import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaService } from './infra/prisma.service';

import { ExperiencesModule } from './modules/experiences/experiences.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    ExperiencesModule,
    ReservationsModule,
    PaymentsModule,
    ProvidersModule,
    UsersModule,
    AuthModule,
    NotificationsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
