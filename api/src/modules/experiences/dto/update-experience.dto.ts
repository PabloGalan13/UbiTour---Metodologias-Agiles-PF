import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class UpdateExperienceDto {
  @IsOptional() @IsString()
  title?: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsNumber()
  price?: number;

  @IsOptional() @IsNumber()
  capacity?: number;

  @IsOptional() @IsString()
  startAt?: string;

  @IsOptional() @IsString()
  endAt?: string;

  @IsOptional() @IsString()
  location?: string; // seguirá siendo JSON string

  @IsOptional() @IsBoolean()
  isActive?: boolean;
}