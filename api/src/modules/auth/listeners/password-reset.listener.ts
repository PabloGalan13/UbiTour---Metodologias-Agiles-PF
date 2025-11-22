import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class PasswordResetListener {
  constructor(private readonly mailer: MailerService) {}

  @OnEvent('password.reset.request')
  async handlePasswordReset(payload: {
    email: string;
    name: string;
    resetUrl: string;
  }) {
    await this.mailer.sendMail({
      to: payload.email,
      subject: 'Restablecer contraseña',
      html: `
        <h2>Hola ${payload.name}</h2>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${payload.resetUrl}">${payload.resetUrl}</a>
      `,
    });
  }
}
