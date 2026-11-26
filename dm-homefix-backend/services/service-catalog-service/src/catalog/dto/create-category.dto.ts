import { IsString, MaxLength, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateCategoryDto {
  @ApiProperty({ example: 'Plumbing' }) @IsString() @MaxLength(100) nameEn: string;
  @ApiProperty({ example: 'ቧንቧ ሥራ' }) @IsString() @MaxLength(100) nameAm: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) descriptionEn?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) descriptionAm?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}
