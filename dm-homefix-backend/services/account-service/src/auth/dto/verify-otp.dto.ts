import { IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty()
  @IsUUID()
  accountId: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 8)
  otp: string;
}
