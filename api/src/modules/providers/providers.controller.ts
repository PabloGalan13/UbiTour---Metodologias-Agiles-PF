import { Controller, Get } from '@nestjs/common';

@Controller('providers')
export class ProvidersController {
    @Get()
    base() {return { message: 'Providers endpoint' }; }
}
