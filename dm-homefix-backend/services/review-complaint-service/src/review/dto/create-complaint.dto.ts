import { IsUUID, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateComplaintDto {
  @ApiProperty() @IsUUID() bookingId: string;
  @ApiProperty() @IsString() @MaxLength(100) subject: string;
  @ApiProperty() @IsString() @MaxLength(2000) description: string;
}
