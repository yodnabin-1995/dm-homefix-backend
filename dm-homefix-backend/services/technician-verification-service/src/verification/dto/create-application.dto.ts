import { IsString, IsInt, Min, Max, IsArray, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateApplicationDto {
  @ApiProperty() @IsString() @MaxLength(1000) bio: string;
  @ApiProperty() @IsInt() @Min(0) @Max(50) experienceYears: number;
  @ApiProperty({ type: [String] }) @IsArray() @IsString({ each: true }) serviceCategories: string[];
  @ApiProperty() @IsString() @MaxLength(255) serviceArea: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) documentRefs?: string[];
}
