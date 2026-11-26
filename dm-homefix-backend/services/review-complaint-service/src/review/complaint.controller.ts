import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

class UpdateComplaintDto {
  @ApiPropertyOptional({ enum: ['OPEN','IN_REVIEW','RESOLVED','CLOSED'] }) @IsIn(['OPEN','IN_REVIEW','RESOLVED','CLOSED']) status: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resolution?: string;
}

@ApiTags('complaints') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('complaints')
export class ComplaintController {
  constructor(private svc: ComplaintService) {}
  @Post() @Roles('CUSTOMER') @ApiOperation({ summary: 'Submit a complaint' })
  create(@Request() req: any, @Body() dto: CreateComplaintDto) { return this.svc.create(req.user.sub, dto); }
  @Get() @Roles('ADMIN') @ApiOperation({ summary: 'Admin: list all complaints' })
  findAll() { return this.svc.findAll(); }
  @Get(':id') @Roles('ADMIN','CUSTOMER') @ApiOperation({ summary: 'Get complaint by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.svc.findOne(id); }
  @Patch(':id/status') @Roles('ADMIN') @ApiOperation({ summary: 'Admin: update complaint status' })
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Request() req: any, @Body() dto: UpdateComplaintDto) {
    return this.svc.updateStatus(id, dto.status, req.user.sub, dto.resolution);
  }
}
