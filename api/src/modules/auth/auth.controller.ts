// src/modules/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    await this.authService.register(dto);

    return `
      <p class="text-xs text-green-600 mt-2">
        Cuenta creada con éxito. Revisa tu correo de confirmación.
      </p>
    `;
  }
}
