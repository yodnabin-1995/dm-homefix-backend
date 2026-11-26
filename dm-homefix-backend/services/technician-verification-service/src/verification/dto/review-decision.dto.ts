import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class ReviewDecisionDto {
  @ApiProperty({ enum: ['APPROVED', 'REJECTED', 'INFORMATION_REQUESTED', 'SUSPENDED', 'REVOKED'] })
  @IsIn(['APPROVED', 'REJECTED', 'INFORMATION_REQUESTED', 'SUSPENDED', 'REVOKED'])
  decision: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(1000) reason?: string;
}
