import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

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

    const user = await this.usersService.createVisitor({
      email: dto.email,
      name: dto.name,
      passwordHash,
    });

    this.eventEmitter.emit('user.registered', {
      email: user.email,
      name: user.name,
    });

    return {
      message: 'Cuenta creada con éxito. Revisa tu correo de confirmación.',
    };
  }
}
