import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { v4 as uuidv4 } from 'uuid';

const TRANSITIONS: Record<string, string[]> = {
  ASSIGNED: ['TECHNICIAN_EN_ROUTE', 'CANCELLED'],
  TECHNICIAN_EN_ROUTE: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async createJob(dto: CreateJobDto) {
    return this.prisma.job.create({
      data: {
        id: uuidv4(),
        bookingId: dto.bookingId,
        technicianId: dto.technicianId,
        status: 'ASSIGNED',
      },
    });
  }

  async updateStatus(jobId: string, userId: string, role: string, dto: UpdateJobStatusDto) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('JOB_NOT_FOUND');
    if (role === 'TECHNICIAN' && job.technicianId !== userId) throw new ForbiddenException();
    if (!(TRANSITIONS[job.status] ?? []).includes(dto.status))
      throw new BadRequestException(`INVALID_TRANSITION: ${job.status} -> ${dto.status}`);
    const updated = await this.prisma.job.update({
      where: { id: jobId },
      data: {
        status: dto.status,
        completedAt: dto.status === 'COMPLETED' ? new Date() : undefined,
      },
    });
    await this.prisma.jobStatusHistory.create({
      data: {
        id: uuidv4(),
        jobId,
        fromStatus: job.status,
        toStatus: dto.status,
        changedBy: userId,
      },
    });
    return updated;
  }

  async getJob(jobId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: { statusHistory: { orderBy: { createdAt: 'asc' } } },
    });
    if (!job) throw new NotFoundException('JOB_NOT_FOUND');
    return job;
  }

  async getJobsByTechnician(technicianId: string) {
    return this.prisma.job.findMany({ where: { technicianId }, orderBy: { createdAt: 'desc' } });
  }

  async adminList() {
    return this.prisma.job.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
