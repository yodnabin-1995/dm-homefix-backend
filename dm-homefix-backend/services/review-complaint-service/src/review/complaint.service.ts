import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ComplaintService {
  constructor(private prisma: PrismaService) {}

  async create(customerId: string, dto: CreateComplaintDto) {
    return this.prisma.complaint.create({ data: { id: uuidv4(), bookingId: dto.bookingId, customerId, subject: dto.subject, description: dto.description, status: 'OPEN' } });
  }

  async findAll() { return this.prisma.complaint.findMany({ orderBy: { createdAt: 'desc' } }); }

  async findOne(id: string) {
    const c = await this.prisma.complaint.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('COMPLAINT_NOT_FOUND');
    return c;
  }

  async updateStatus(id: string, status: string, adminId: string, resolution?: string) {
    await this.findOne(id);
    return this.prisma.complaint.update({ where: { id }, data: { status, resolution, resolvedBy: adminId, resolvedAt: ['RESOLVED','CLOSED'].includes(status) ? new Date() : undefined } });
  }
}
