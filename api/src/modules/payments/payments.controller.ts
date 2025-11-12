import { Controller, Get } from '@nestjs/common';

@Controller('payments')
export class PaymentsController {
    @Get()
    base() {return { message: 'Payments endpoint' }; }
}
