import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateJobDto {
  @ApiProperty() @IsUUID() bookingId: string;
  @ApiProperty() @IsUUID() technicianId: string;
}
