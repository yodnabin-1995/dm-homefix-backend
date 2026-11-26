import { IsUUID, IsString, IsIn, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SendNotificationDto {
  @ApiProperty() @IsUUID() recipientId: string;
  @ApiProperty({ enum: ['in-app','email','sms'] }) @IsIn(['in-app','email','sms']) channel: string;
  @ApiProperty({ enum: ['en','am'] }) @IsIn(['en','am']) language: string;
  @ApiProperty() @IsString() @MaxLength(200) subject: string;
  @ApiProperty() @IsString() @MaxLength(2000) body: string;
}
