import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service'; // Asumiendo esta ruta

import { CreateExperienceDto } from '../auth/dto/create-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(private readonly prisma: PrismaService) {}

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
    return this.prisma.experience.create({
      data: {
        providerId: providerId,
        title: dto.title,
        description: dto.description,
        price: dto.price, // Prisma maneja la conversión de Number a Decimal
        capacity: dto.capacity,
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        location: dto.location,
        photos: dto.photos,
        isActive: true, // Por defecto
      },
      // Selecciona solo los campos de confirmación
      select: { id: true, title: true, providerId: true }
    });
  }
}