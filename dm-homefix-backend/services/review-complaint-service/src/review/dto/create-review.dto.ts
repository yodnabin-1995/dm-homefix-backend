import { IsUUID, IsInt, Min, Max, IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateReviewDto {
  @ApiProperty() @IsUUID() jobId: string;
  @ApiProperty() @IsUUID() technicianId: string;
  @ApiProperty({ minimum: 1, maximum: 5 }) @IsInt() @Min(1) @Max(5) rating: number;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(1000) comment?: string;
}
