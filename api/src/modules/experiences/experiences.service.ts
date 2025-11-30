import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';
import { FilterExperienceDto } from './dto/filter-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(private prisma: PrismaService) {}

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

  async filter(dto: FilterExperienceDto) {
    const baseFilters: any = {
      isActive: true,
    };

    if (dto.date) {
      baseFilters.startAt = { gte: new Date(dto.date) };
    }

    if (dto.minPrice || dto.maxPrice) {
      baseFilters.price = {};
      if (dto.minPrice) baseFilters.price.gte = Number(dto.minPrice);
      if (dto.maxPrice) baseFilters.price.lte = Number(dto.maxPrice);
    }

    if (!dto.location) {
      return this.prisma.experience.findMany({
        where: baseFilters,
        include: {
          provider: { select: { user: { select: { name: true } } } },
        },
      });
    }

    const sql = `
      SELECT id
      FROM Experience
      WHERE isActive = 1
      AND LOWER(JSON_UNQUOTE(JSON_EXTRACT(location, '$.city'))) LIKE LOWER(?)
    `;

    const rows: Array<{ id: string }> = await this.prisma.$queryRawUnsafe(
      sql,
      `%${dto.location}%`
    );

    if (rows.length === 0) return [];
    const ids = rows.map(r => r.id);

    return this.prisma.experience.findMany({
      where: {
        ...baseFilters,
        id: { in: ids },
      },
      include: {
        provider: { select: { user: { select: { name: true } } } },
      },
    });
  }
}
