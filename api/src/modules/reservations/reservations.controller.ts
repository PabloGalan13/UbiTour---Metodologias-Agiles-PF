import { Controller, Get } from '@nestjs/common';

@Controller('reservations')
export class ReservationsController {
    @Get()
    base() {return { message: 'Reservations endpoint' }; }
}
