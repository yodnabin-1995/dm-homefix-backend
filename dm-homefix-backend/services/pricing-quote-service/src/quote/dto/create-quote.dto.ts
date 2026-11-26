import { IsUUID, IsInt, Min, IsString, MaxLength, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateQuoteDto {
  @ApiProperty() @IsUUID() bookingId: string;
  @ApiProperty({ description: 'Amount in minor units (e.g. Ethiopian cents)' })
  @IsInt()
  @Min(1)
  amountMinorUnits: number;
  @ApiProperty({ default: 'ETB' }) @IsString() @MaxLength(3) currency: string;
  @ApiProperty() @IsString() @MaxLength(500) description: string;
  @ApiProperty() @IsDateString() validUntil: string;
  @ApiProperty() @IsString() @MaxLength(500) terms: string;
}
