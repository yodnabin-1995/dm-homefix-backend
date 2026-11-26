import { IsString, MaxLength, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateCategoryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) nameEn?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) nameAm?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) descriptionEn?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) descriptionAm?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}
