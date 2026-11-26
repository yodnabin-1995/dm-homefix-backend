import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty()
  @IsUUID()
  accountId: string;

  @ApiProperty()
  @IsString()
  refreshToken: string;
}
