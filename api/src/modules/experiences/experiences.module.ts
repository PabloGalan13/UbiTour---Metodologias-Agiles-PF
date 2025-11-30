import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express'; // <--- IMPORTAR ESTO
import { ExperiencesController } from './experiences.controller';
import { ExperiencesService } from './experiences.service';
import { PrismaService } from '../../infra/prisma.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    // 🔑 CONFIGURACIÓN DE MULTER: Aquí definimos dónde se guardan los archivos
    MulterModule.register({ 
        dest: './uploads', // Guarda los archivos temporalmente en la carpeta 'uploads'
    }),
  ],
  controllers: [ExperiencesController],
  providers: [
    ExperiencesService, 
    PrismaService
  ],
})
export class ExperiencesModule {}