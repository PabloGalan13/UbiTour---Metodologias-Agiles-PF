import { Controller, Post, Body, UseGuards, Req, UseInterceptors, UploadedFiles, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from '../auth/dto/create-experience.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

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
    @Req() req: any, // Usamos 'any' defensivamente para asegurar el acceso a req.user
    @UploadedFiles() photos: Express.Multer.File[]
  ) {
    const user = req.user; // El objeto resuelto por Passport

    // 1. **COMPROBACIÓN DE ROL Y EXISTENCIA DEL ID** (CRÍTICO)
    // --- PUNTO DE CONTROL 1: Existencia del Usuario (Token Válido) ---
    // Si no hay objeto de usuario, el guard JWT falló o el token era malo.
    if (!user) {
        throw new ForbiddenException('Error de Seguridad: Token no resuelto o inválido. No se encontró usuario en la solicitud.');
    }

    // --- PUNTO DE CONTROL 2: Tipo de ID (Verificación de String/UUID) ---
    // Si el ID no existe o no es un string (UUID), la inyección falló.
    if (!user.userId || typeof user.userId !== 'string') {
        throw new ForbiddenException('Error de Tipo: El ID de usuario no es válido (null/undefined/no-string)xdxxdxd.');
    }

    // --- PUNTO DE CONTROL 3: Comprobación de Rol (Proveedor) ---
    // Verifica si el rol es el correcto.
    if (user.role !== 'PROVIDER') {
        throw new ForbiddenException('Acceso denegado: Solo los proveedores pueden crear experiencias.');
    } 

    const userId = user.userId; // Extraemos el ID, que sabemos que es un string

    // 2. Obtener el providerId (Buscando en la BD con el userId comprobado)
    const providerId = await this.experiencesService.findProviderIdByUserId(userId);
    
    // ... (El resto de la lógica de fotos y DTO, que ya es correcta)
    
    // 3. Procesar las URLs de las fotos
    const photoUrls = photos.map(file => `http://storage.ubitur.com/${file.originalname}`);
    const finalDto = {
        ...createExperienceDto,
        photos: JSON.stringify(photoUrls),
    }

    // 4. Crear la experiencia
    return this.experiencesService.create(finalDto, providerId);
  }
}
