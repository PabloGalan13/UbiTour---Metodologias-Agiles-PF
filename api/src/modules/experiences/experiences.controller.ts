import { Controller, Post, Body, UseGuards, Req, UseInterceptors, UploadedFiles, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from '../auth/dto/create-experience.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('experiences')
@UseGuards(AuthGuard('jwt'))
export class ExperiencesController {
    constructor(private readonly experiencesService: ExperiencesService) { }

    @Post() // POST /experiences
    @UseInterceptors(
        // Usamos FilesInterceptor para múltiples archivos, nombrados 'photos'
        FilesInterceptor('photos', 10) 
    )
    async create(
        @Body() createExperienceDto: CreateExperienceDto,
        @Req() req: any, // Aquí se inyecta el usuario
        @UploadedFiles() photos: Express.Multer.File[] // Aquí se inyectan los archivos
    ) {
        const user = req.user; 
        
        // 1. COMPROBACIONES CRÍTICAS DE SEGURIDAD Y TIPOS (Ya definidas)
        if (!user || !user.userId || typeof user.userId !== 'string') {
            throw new ForbiddenException('Error de Seguridad: Token no resuelto o inválido.');
        }
        if (user.role !== 'PROVIDER') {
            throw new ForbiddenException('Acceso denegado: Solo los proveedores pueden crear experiencias.');
        } 

        const userId = user.userId;
        
        // 2. OBTENER ProviderId
        const providerId = await this.experiencesService.findProviderIdByUserId(userId);
        
        // 3. PROCESAMIENTO DE FOTOS Y CORRECCIÓN DE JSON
        // Convertimos el array de archivos a un array de URLs simuladas (string[])
        const photoUrls = photos.map(file => {
            // Nota: En producción, aquí harías la subida real a S3 y obtendrías la URL pública.
            return `http://storage.ubitur.com/experiences/${file.filename || file.originalname}`;
        });
        
        // 4. CREAR DTO FINAL
        const finalDto = {
            ...createExperienceDto,
            // 🔑 CORRECCIÓN: Pasar el ARRAY DE STRINGS (JSON nativo) directamente.
            photos: photoUrls, 
            // location: ya debe ser un string JSON válido gracias a class-transformer.
        }

        // 5. Crear la experiencia
        return this.experiencesService.create(finalDto, providerId);
    }
}