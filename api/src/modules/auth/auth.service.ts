import { Injectable, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Correo ya registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const verificationToken = randomBytes(32).toString('hex');

    const user = await this.usersService.createVisitor({
      email: dto.email,
      name: dto.name,
      passwordHash,
      verificationToken,
    });

    const confirmationUrl = `http://localhost:3000/auth/confirm?token=${verificationToken}`;

    this.eventEmitter.emit('user.registered', {
      email: user.email,
      name: user.name,
      confirmationUrl,
    });

    return `
      <p class="text-xs text-green-600 mt-2">
        Cuenta creada con éxito. Revisa tu correo de confirmación.
      </p>
    `;
  }

  // Nuevo método para registrar un proveedor
async registerProvider(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
        throw new BadRequestException('Correo ya registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const verificationToken = randomBytes(32).toString('hex');

    // 1. Crear el usuario con rol PROVIDER
    const user = await this.usersService.createProvider({ // Llamaremos a este nuevo método
        email: dto.email,
        name: dto.name,
        passwordHash,
        verificationToken,
    });
    
    // 2. Crear la entrada en la tabla Provider, vinculada al nuevo usuario
    await this.usersService.createProviderEntry(user.id);

    // 3. Emitir evento de confirmación de correo
    const confirmationUrl = `http://localhost:3000/auth/confirm?token=${verificationToken}`;

    this.eventEmitter.emit('user.registered', {
        email: user.email,
        name: user.name,
        confirmationUrl,
    });

    return `
      <p class="text-xs text-green-600 mt-2">
        Cuenta de Proveedor creada con éxito. Revisa tu correo de confirmación.
      </p>
    `;
}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new BadRequestException('Credenciales inválidas');
    }

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new BadRequestException('Credenciales inválidas');
    }

    if (!user.isVerified) {
      throw new BadRequestException('Debes confirmar tu correo antes de iniciar sesión');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async requestPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Correo no encontrado');
    }

    const resetToken = randomBytes(32).toString('hex');

    await this.usersService.setResetToken(user.id, resetToken);

    const resetUrl = `http://127.0.0.1:5500/web/reset-password.html?token=${resetToken}`;

    // Enviar evento para mail
    this.eventEmitter.emit('password.reset.request', {
      email: user.email,
      name: user.name,
      resetUrl,
    });

    return `
      <p class="text-xs text-green-600 mt-2">
        Si el correo existe, se envió un enlace para restablecer tu contraseña.
      </p>
    `;
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);
    if (!user) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.usersService.updatePassword(user.id, passwordHash);

    return `
      <p class="text-xs text-green-600 mt-2">
        Tu contraseña ha sido actualizada correctamente.
      </p>
      <a href="http://127.0.0.1:5500/web/login.html" class="text-blue-600 underline text-xs">
        Iniciar sesión
      </a>
    `;
  }

}
