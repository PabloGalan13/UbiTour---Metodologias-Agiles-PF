import { IsOptional, IsString, IsNumberString, IsIn } from 'class-validator';

export class FilterExperienceDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive', 'all'])
  status?: string;
}