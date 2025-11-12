import { Controller, Get } from '@nestjs/common';

@Controller('experiences')
export class ExperiencesController {
    @Get()
    base() {return { message: 'Experiences endpoint' }; }
}
