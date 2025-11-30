import { Controller, Get, Query } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { FilterExperienceDto } from './dto/filter-experience.dto';

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Get()
  findAll() {
    return this.experiencesService.findAll();
  }

  @Get('filter')
  filter(@Query() query: FilterExperienceDto) {
    return this.experiencesService.filter(query);
  }
}
