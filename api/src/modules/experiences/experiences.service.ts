import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service'; // Asumiendo esta ruta

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

    return this.prisma.experience.create({
      data: {
        providerId: providerId,

        // Ahora usamos la variable renombrada, que TypeScript sabe que es un string
        location: JSON.parse(locationString),

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
}