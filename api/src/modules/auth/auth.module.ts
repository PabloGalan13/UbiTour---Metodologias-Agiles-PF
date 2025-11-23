import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PasswordResetListener } from './listeners/password-reset.listener';
import { PassportModule } from '@nestjs/passport'; 
import { JwtStrategy } from './jwt.strategy'; // <--- 1. IMPORTAR LA ESTRATEGIA

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    PasswordResetListener,
    JwtStrategy, // <--- 2. REGISTRAR LA ESTRATEGIA AQUÍ
  ],
})
export class AuthModule { }