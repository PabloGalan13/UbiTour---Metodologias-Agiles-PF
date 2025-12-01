import { Controller, Post, Body, UseGuards, Req, UseInterceptors, UploadedFiles, ForbiddenException,Get,Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from '../auth/dto/create-experience.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilterExperienceDto } from './dto/filter-experience.dto';

@Controller('experiences')
export class ExperiencesController {
    constructor(private readonly experiencesService: ExperiencesService) { }

    @UseGuards(AuthGuard('jwt'))
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

        // 3. PROCESAMIENTO DE FOTOS Y CREACIÓN DE URLs LOCALES
        const photoUrls = photos.map(file => {
            // 🔑 CAMBIO CLAVE: Usamos el nombre que Multer le asignó al archivo.
            // Multer usa 'filename' si se configura storage. Usaremos 'filename' o 'originalname' como fallback.
            const filename = file.filename || file.originalname;

            // CONSTRUCCIÓN DE LA URL PÚBLICA DEL SERVIDOR LOCAL
            // Asumimos que el servidor NestJS está sirviendo la carpeta 'uploads'
            // a través de la ruta pública '/uploads' o '/'
            return `http://localhost:3000/uploads/${filename}`;
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
    //Obtener todas experiencias
    @Get()
    async findAll() {
    return this.experiencesService.findAll();
    }
    //Obtener experiencias por filtro
    @Get('filter')
    async filter(@Query() filters: FilterExperienceDto) {
        return this.experiencesService.filter(filters);
    }

    


}