import { IsNotEmpty, IsNumber, IsString, IsInt, IsDateString, IsJSON, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer'; // <-- ¡IMPORTAR ESTO!

export class CreateExperienceDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Type(() => Number) // <-- CONVERTIR STRING A NUMBER
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número con máximo 2 decimales.' })
  @Min(0, { message: 'El precio no puede ser negativo.' })
  price: number;

  @IsNotEmpty()
  @Type(() => Number) // <-- CONVERTIR STRING A NUMBER
  @IsInt({ message: 'La capacidad debe ser un número entero.' })
  @Min(1, { message: 'La capacidad mínima es de 1 persona.' })
  capacity: number;

  @IsNotEmpty()
  @IsDateString()
  startAt: string;

  @IsNotEmpty()
  @IsDateString()
  endAt: string;

  // location ahora es obligatorio, pero la validación JSON falló por el input 'xd'
  @IsNotEmpty({ message: 'La ubicación es obligatoria.' })
  @IsJSON({ message: 'El formato de ubicación debe ser un JSON válido.' })
  location: string;

  // ⚠️ QUITAR PHOTOS DE AQUÍ: Se manejará en el controlador como archivo.
  // Pero lo dejamos como Optional si el servicio lo necesita. 
  // No debe llevar @IsJSON() ni @IsNotEmpty() si es un archivo.
  @IsOptional()
  photos: string; // Se llenará en el controlador con las URLs.
}