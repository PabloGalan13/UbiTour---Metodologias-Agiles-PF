import { Injectable, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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
}
