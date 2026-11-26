import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsIn,
  Matches,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiPropertyOptional({ example: 'customer@example.com' })
  @ValidateIf((o) => !o.phone)
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+251911000000' })
  @ValidateIf((o) => !o.email)
  @IsString()
  @Matches(/^\+?[0-9]{9,15}$/, { message: 'Invalid phone number' })
  phone?: string;

  @ApiProperty({ example: 'Abebe' })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Kebede' })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @ApiPropertyOptional({ enum: ['CUSTOMER', 'TECHNICIAN'], default: 'CUSTOMER' })
  @IsOptional()
  @IsIn(['CUSTOMER', 'TECHNICIAN'])
  role?: string;

  @ApiPropertyOptional({ enum: ['en', 'am'], default: 'en' })
  @IsOptional()
  @IsIn(['en', 'am'])
  preferredLanguage?: string;
}
