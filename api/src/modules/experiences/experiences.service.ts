import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service'; // Asumiendo esta ruta

import { CreateExperienceDto } from '../auth/dto/create-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(private readonly prisma: PrismaService) { }

  async findProviderIdByUserId(userId: string): Promise<string> {

    // CAMBIAR findUnique POR findFirst
    const provider = await this.prisma.provider.findFirst({
      where: { userId: userId }, // Buscar el primer registro donde userId coincida
      select: { id: true, kycStatus: true }
    });

    if (!provider) {
      // Si el usuario existe, pero no tiene entrada en la tabla Provider
      throw new NotFoundException('Acceso denegado: El usuario no ha completado el registro de proveedor.');
    }

    // Opcional: validación del estado
    if (provider.kycStatus !== 'unverified' && provider.kycStatus !== 'verified') {
      // Podrías añadir más lógica aquí si el estado "unverified" debe impedir la creación.
    }

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