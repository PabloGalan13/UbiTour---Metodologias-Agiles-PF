import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';
import { FilterExperienceDto } from './dto/filter-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(private prisma: PrismaService) {}

  // HU8 — obtener todas las experiencias activas
  findAll() {
    return this.prisma.experience.findMany({
      where: { isActive: true },
      include: {
        provider: {
          select: {
            user: { select: { name: true } },
          },
        },
      },
    });
  }

  // HU8 — filtrar por ubicación, precio y fecha
  async filter(dto: FilterExperienceDto) {
    const filters: Record<string, any> = { isActive: true };

    if (dto.location) {
      filters.location = {
        contains: dto.location,
      };
    }

    if (dto.date) {
      filters.startAt = {
        gte: new Date(dto.date),
      };
    }

    if (dto.minPrice || dto.maxPrice) {
      filters.price = {};
      if (dto.minPrice) filters.price.gte = Number(dto.minPrice);
      if (dto.maxPrice) filters.price.lte = Number(dto.maxPrice);
    }

    return this.prisma.experience.findMany({
      where: filters,
      include: {
        provider: {
          select: {
            user: { select: { name: true } },
          },
        },
      },
    });
  }
}
