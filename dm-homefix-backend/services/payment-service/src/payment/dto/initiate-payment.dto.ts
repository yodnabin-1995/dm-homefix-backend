import { IsUUID, IsInt, Min, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class InitiatePaymentDto {
  @ApiProperty() @IsUUID() bookingId: string;
  @ApiProperty({ description: 'Amount in minor units' }) @IsInt() @Min(1) amountMinorUnits: number;
  @ApiProperty({ default: 'ETB' }) @IsString() @MaxLength(3) currency: string;
}
