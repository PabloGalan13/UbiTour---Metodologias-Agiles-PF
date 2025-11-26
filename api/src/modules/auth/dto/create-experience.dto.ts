import { IsNotEmpty, IsNumber, IsString, IsInt, IsDateString, IsJSON, Min, IsOptional, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExperienceDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número con máximo 2 decimales.' })
  @Min(0, { message: 'El precio no puede ser negativo.' })
  price: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt({ message: 'La capacidad debe ser un número entero.' })
  @Min(1, { message: 'La capacidad mínima es de 1 persona.' })
  capacity: number;

  @IsNotEmpty()
  @IsDateString()
  startAt: string;

  @IsNotEmpty()
  @IsDateString()
  endAt: string;

  // 1. CAMPO LOCATION (JSON String)
  // Se sigue validando como JSON string ya que es la forma en que se envía desde el formulario
  @IsNotEmpty({ message: 'La ubicación es obligatoria.' })
  @IsJSON({ message: 'El formato de ubicación debe ser un JSON válido.' })
  location: string;

  // 2. CAMPO PHOTOS (URLs)
  // Este campo lo llenamos en el controlador con un array de URLs (string[]). 
  // No debe ser IsNotEmpty porque el archivo llega por UploadedFiles.
  // Pero debe ser un array con al menos un elemento si quieres que sea obligatorio.
  @IsOptional() // Lo dejamos opcional ya que el controlador lo llena
  @IsArray() // Esperamos un array de strings (URLs)
  @ArrayMinSize(1, { message: 'Debes incluir al menos una foto para la experiencia.' })
  @IsString({ each: true }) // Cada elemento del array debe ser un string (la URL)
  photos: string[]; // <-- Cambiamos el tipo de 'string' a 'string[]'
}