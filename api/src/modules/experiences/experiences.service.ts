import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service'; // Asumiendo esta ruta
import { FilterExperienceDto } from './dto/filter-experience.dto';
import { CreateExperienceDto } from '../auth/dto/create-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(private readonly prisma: PrismaService) { }

  // Nuevo método para encontrar el ID de la tabla Provider a partir del ID del usuario
  async findProviderIdByUserId(userId: string): Promise<string> {
    const provider = await this.prisma.provider.findUnique({
      where: { userId: userId },
      select: { id: true, kycStatus: true }
    });

    if (!provider) {
      throw new NotFoundException('Usuario no registrado como proveedor.');
    }
    // Opcional: Si el kycStatus es importante, puedes validar aquí (ej. 'unverified')

    return provider.id;
  }

  // Método para crear la experiencia
  async create(dto: CreateExperienceDto, providerId: string) {
    // 🔑 SOLUCIÓN: Renombrar 'location' a 'locationString' al desestructurar
    const { location: locationString, photos, ...rest } = dto;
    const parsedLocation = JSON.parse(locationString);

    return this.prisma.experience.create({
      data: {
        providerId: providerId,
        location: parsedLocation,
        photos: photos,
        title: rest.title,
        description: rest.description,
        price: rest.price,
        capacity: rest.capacity,
        startAt: new Date(rest.startAt),
        endAt: new Date(rest.endAt),
        isActive: true,
      },
      select: { id: true, title: true, providerId: true }
    });
  }
  //Obtener todas las experiencias
  async findAll() {
    return this.prisma.experience.findMany({
      where: { isActive: true },
      orderBy: { startAt: 'asc' },
    });
  }
  //Filtros de las experiencias
  async filter(dto: FilterExperienceDto) {
    const baseFilters: any = {
      isActive: true,
    };

    // FILTRO POR FECHA
    if (dto.date) {
      baseFilters.startAt = { gte: new Date(dto.date) };
    }

    // FILTRO POR PRECIO
    if (dto.city) {
      const sql = `
        SELECT id
        FROM Experience
        WHERE isActive = 1
        AND LOWER(JSON_UNQUOTE(JSON_EXTRACT(location, '$.city')))
          LIKE LOWER(?)
      `;

      const rows: Array<{ id: string }> = await this.prisma.$queryRawUnsafe(
        sql,
        `%${dto.city}%`
      );

      if (rows.length === 0) return [];

      const ids = rows.map(r => r.id);

      return this.prisma.experience.findMany({
        where: {
          id: { in: ids },
          ...baseFilters
        }
      });
    }

    // SIN CITY → devolvemos todo lo filtrado por precio/fecha
    return this.prisma.experience.findMany({
      where: baseFilters
    });
  }
}