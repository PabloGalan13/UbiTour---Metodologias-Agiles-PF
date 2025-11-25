import { Controller, Post, Body, UseGuards, Req, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from '../auth/dto/create-experience.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

// Asumo que tienes una interfaz o clase para el usuario autenticado (extraído del token)
interface AuthenticatedUser {
    userId: string;
    role: string;
}

@Controller('experiences')
@UseGuards(AuthGuard('jwt')) // 🛡️ Protege todos los endpoints de este controlador
export class ExperiencesController {
    constructor(private readonly experiencesService: ExperiencesService) { }

    @Post() // POST /experiences
    @UseInterceptors(
        // Configurar multer para que espere múltiples archivos del campo 'photos'
        // El límite de 10 es un ejemplo; ajusta la configuración de almacenamiento real
        FilesInterceptor('photos', 10, {
            // Opcional: puedes añadir opciones de almacenamiento, destino, etc., aquí.
            // Por ahora, usaremos el almacenamiento predeterminado en memoria o temporal.
        })
    )
    async create(
        @Body() createExperienceDto: CreateExperienceDto,
        @Req() req: { user: AuthenticatedUser },
        @UploadedFiles() photos: Express.Multer.File[] // <-- Aquí recibimos los archivos
    ) {
        const userId = req.user.userId;
        const providerId = await this.experiencesService.findProviderIdByUserId(userId);

        // 1. Procesar las URLs de las fotos (simulación de almacenamiento)
        const photoUrls = photos.map(file => {
            // NOTA: Aquí se debe implementar la subida real a S3, Azure o el sistema de archivos local.
            // Por ahora, solo extraemos la URL simulada o el nombre de archivo.
            return `http://storage.ubitur.com/${file.originalname}`;
        });

        // 2. Adjuntar las URLs procesadas al DTO
        // Pasamos el JSON de las URLs al servicio
        const finalDto = {
            ...createExperienceDto,
            photos: JSON.stringify(photoUrls),
        }

        // 3. Crear la experiencia
        return this.experiencesService.create(finalDto, providerId);
    }
}
