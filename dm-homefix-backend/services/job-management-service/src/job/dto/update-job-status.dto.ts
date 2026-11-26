import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateJobStatusDto {
  @ApiProperty({ enum: ['TECHNICIAN_EN_ROUTE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] })
  @IsIn(['TECHNICIAN_EN_ROUTE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  status: string;
}
