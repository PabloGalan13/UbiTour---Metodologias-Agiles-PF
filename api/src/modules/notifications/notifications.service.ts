import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  @OnEvent('user.registered')
  handleUserRegistered(payload: { email: string; name: string }) {
    this.logger.log(
      `Enviando correo de confirmación a ${payload.email} (usuario: ${payload.name})`,
    );

  }
}
