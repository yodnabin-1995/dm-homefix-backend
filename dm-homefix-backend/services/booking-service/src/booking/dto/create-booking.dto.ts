import { IsString, IsUUID, IsDateString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateBookingDto {
  @ApiProperty() @IsUUID() serviceCategoryId: string;
  @ApiProperty() @IsString() @MaxLength(500) problemDescription: string;
  @ApiProperty() @IsString() @MaxLength(255) location: string;
  @ApiProperty() @IsDateString() preferredSchedule: string;
  @ApiPropertyOptional() @IsOptional() @IsString() idempotencyKey?: string;
}
