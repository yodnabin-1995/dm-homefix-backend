import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(customerId: string, dto: CreateReviewDto) {
    const existing = await this.prisma.review.findFirst({ where: { jobId: dto.jobId, customerId } });
    if (existing) throw new ConflictException('REVIEW_ALREADY_SUBMITTED');
    return this.prisma.review.create({ data: { id: uuidv4(), jobId: dto.jobId, customerId, technicianId: dto.technicianId, rating: dto.rating, comment: dto.comment } });
  }

  async getForTechnician(technicianId: string) {
    return this.prisma.review.findMany({ where: { technicianId }, orderBy: { createdAt: 'desc' } });
  }

  async getForJob(jobId: string) {
    return this.prisma.review.findMany({ where: { jobId } });
  }
}
