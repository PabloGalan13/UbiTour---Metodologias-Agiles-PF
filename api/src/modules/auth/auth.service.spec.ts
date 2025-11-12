import { BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RegisterDto } from './dto/register.dto';

describe('AuthService - register', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn(),
      createVisitor: jest.fn(),
    } as any;

    eventEmitter = {
      emit: jest.fn(),
    } as any;

    authService = new AuthService(usersService, eventEmitter);
  });

  it('debe crear la cuenta cuando el correo no existe y emitir evento', async () => {
    const dto: RegisterDto = {
      email: 'nuevo@example.com',
      name: 'Nuevo Usuario',
      password: 'secreto123',
    };

    usersService.findByEmail.mockResolvedValue(null);

    usersService.createVisitor.mockResolvedValue({
      id: '1',
      email: dto.email,
      name: dto.name,
      password: 'hash',
      role: 'VISITOR',
      status: 'active',
      createdAt: new Date(),
    } as any);

    const result = await authService.register(dto);

    expect(usersService.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(usersService.createVisitor).toHaveBeenCalled();
    expect(eventEmitter.emit).toHaveBeenCalledWith('user.registered', {
      email: dto.email,
      name: dto.name,
    });
    expect(result.message).toContain('Cuenta creada con éxito');
  });

  it('debe lanzar error "Correo ya registrado" si el correo existe', async () => {
    const dto: RegisterDto = {
      email: 'existe@example.com',
      name: 'Ya Existe',
      password: 'secreto123',
    };

    usersService.findByEmail.mockResolvedValue({ id: '1' } as any);

    await expect(authService.register(dto)).rejects.toThrow(
      BadRequestException,
    );
    await expect(authService.register(dto)).rejects.toThrow(
      'Correo ya registrado',
    );

    expect(usersService.createVisitor).not.toHaveBeenCalled();
    expect(eventEmitter.emit).not.toHaveBeenCalled();
  });
});
