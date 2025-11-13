import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 2525,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  @OnEvent('user.registered')
  async handleUserRegistered(payload: {
    email: string;
    name: string;
    confirmationUrl: string;
  }) {
    this.logger.log(
      `Enviando correo de confirmación a ${payload.email} (usuario: ${payload.name})`,
    );

    await this.transporter.sendMail({
      from: process.env.MAIL_FROM || '"UbiTour" <no-reply@ubitour.test>',
      to: payload.email,
      subject: 'Confirma tu cuenta en UbiTour',
      html: `
        <h2>¡Hola, ${payload.name}!</h2>
        <p>Gracias por registrarte en UbiTour. Para activar tu cuenta, haz clic en el siguiente enlace:</p>
        <p><a href="${payload.confirmationUrl}">${payload.confirmationUrl}</a></p>
        <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>
      `,
    });
  }
}
