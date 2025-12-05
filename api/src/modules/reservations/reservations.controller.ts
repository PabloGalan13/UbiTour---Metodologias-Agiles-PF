import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  async findMyReservations(@Req() req: any) {
    const user = req.user;

    if (user.role !== 'PROVIDER') {
      throw new ForbiddenException('Solo proveedores pueden ver sus reservas.');
    }

    return this.reservationsService.findByProvider(user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const user = req.user;

    if (user.role !== 'PROVIDER') {
      throw new ForbiddenException(
        'Solo proveedores pueden ver detalles de reservas.',
      );
    }

    return this.reservationsService.findByIdForProvider(id, user.userId);
  }
}