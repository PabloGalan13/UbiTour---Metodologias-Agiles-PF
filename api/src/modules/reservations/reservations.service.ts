import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProvider(userId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (!provider) throw new ForbiddenException('No eres proveedor.');

    return this.prisma.reservation.findMany({
      where: {
        experience: {
          providerId: provider.id,
        },
      },
      include: {
        user: true,
        experience: true,
        Payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByIdForProvider(reservationId: string, userId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (!provider) throw new ForbiddenException('No eres proveedor.');

    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        user: true,
        experience: true,
        Payment: true,
      },
    });

    if (!reservation) throw new NotFoundException('Reserva no encontrada.');

    if (reservation.experience.providerId !== provider.id) {
      throw new ForbiddenException('No tienes acceso a esta reserva.');
    }

    return reservation;
  }
}
