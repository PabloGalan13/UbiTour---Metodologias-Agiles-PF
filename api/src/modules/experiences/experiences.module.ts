import { Module } from '@nestjs/common';
import { ExperiencesController } from './experiences.controller';
import { ExperiencesService } from './experiences.service';
import { PrismaService } from '../../infra/prisma.service';
import { UsersModule } from '../users/users.module'; // Necesario para buscar el ProviderId

@Module({
  imports: [
    UsersModule, // Importamos UsersModule para poder usar UsersService
  ],
  controllers: [ExperiencesController],
  providers: [
    ExperiencesService, 
    PrismaService // Necesario para la conexión a la base de datos
  ],
  // Nota: Si otros módulos necesitan usar ExperiencesService, debes añadir exports: [ExperiencesService]
})
export class ExperiencesModule {} // 🔑 La palabra clave 'export' es crucial aquí