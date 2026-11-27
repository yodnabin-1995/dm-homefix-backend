import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@ApiTags('jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('jobs')
export class JobController {
  constructor(private svc: JobService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin: create job from assigned booking' })
  create(@Body() dto: CreateJobDto) {
    return this.svc.createJob(dto);
  }

  @Get('admin')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin: list all jobs' })
  adminList() {
    return this.svc.adminList();
  }

  @Get('my')
  @Roles('TECHNICIAN')
  @ApiOperation({ summary: 'Technician: list my jobs' })
  myJobs(@Req() req: { user: { sub: string; role: string } }) {
    return this.svc.getJobsByTechnician(req.user.sub);
  }

  @Get(':id')
  @Roles('TECHNICIAN', 'CUSTOMER', 'ADMIN')
  @ApiOperation({ summary: 'Get job by ID' })
  getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.getJob(id);
  }

  @Patch(':id/status')
  @Roles('TECHNICIAN', 'ADMIN')
  @ApiOperation({ summary: 'Update job status' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: { user: { sub: string; role: string } },
    @Body() dto: UpdateJobStatusDto,
  ) {
    return this.svc.updateStatus(id, req.user.sub, req.user.role, dto);
  }
}
