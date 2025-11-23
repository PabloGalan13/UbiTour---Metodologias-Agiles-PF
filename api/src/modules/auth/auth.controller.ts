import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  BadRequestException,
  UseGuards, 
  Req, 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport'; 

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AuthGuard('jwt')) 
  @Get('me')
  getMe(@Req() req) {
    return req.user;
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authService.resetPassword(token, password);
  }


  @Get('confirm')
  async confirmEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token requerido');
    }

    const user = await this.usersService.findByVerificationToken(token);
    if (!user) {
      throw new BadRequestException('Token inválido o expirado');
    }

    await this.usersService.markAsVerified(user.id);

    return `
      <div style="font-family: system-ui; padding: 2rem;">
        <h1>Correo verificado ✅</h1>
        <p>Tu cuenta de UbiTour ha sido activada correctamente.</p>
        <a href="http://127.0.0.1:5500/web/login.html" style="color:#2563eb;">
          Ir a iniciar sesión
        </a>
      </div>
    `;
  }
}
