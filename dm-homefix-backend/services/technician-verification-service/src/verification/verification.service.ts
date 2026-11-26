import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewDecisionDto } from './dto/review-decision.dto';
import { EventPublisherService } from './events/event-publisher.service';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED: Record<string, string[]> = {
  DRAFT: ['PENDING_REVIEW'],
  PENDING_REVIEW: ['APPROVED','REJECTED','INFORMATION_REQUESTED'],
  INFORMATION_REQUESTED: ['RESUBMITTED'],
  RESUBMITTED: ['APPROVED','REJECTED','INFORMATION_REQUESTED'],
  APPROVED: ['SUSPENDED','REVOKED'],
  SUSPENDED: ['APPROVED','REVOKED'],
};

@Injectable()
export class VerificationService {
  constructor(private prisma: PrismaService, private events: EventPublisherService) {}

  async createApplication(technicianId: string, dto: CreateApplicationDto) {
    const existing = await this.prisma.verificationApplication.findFirst({ where: { technicianId, status: { notIn: ['REJECTED','REVOKED'] } } });
    if (existing) throw new BadRequestException('ACTIVE_APPLICATION_EXISTS');
    return this.prisma.verificationApplication.create({ data: { id: uuidv4(), technicianId, status: 'DRAFT', bio: dto.bio, experienceYears: dto.experienceYears, serviceCategories: dto.serviceCategories, serviceArea: dto.serviceArea, documentRefs: dto.documentRefs ?? [] } });
  }

  async submitApplication(applicationId: string, technicianId: string) {
    const app = await this.getOwned(applicationId, technicianId);
    this.guard(app.status, 'PENDING_REVIEW');
    const updated = await this.prisma.verificationApplication.update({ where: { id: applicationId }, data: { status: 'PENDING_REVIEW', submittedAt: new Date() } });
    await this.events.publishSubmitted(applicationId, technicianId);
    return updated;
  }

  async resubmitApplication(applicationId: string, technicianId: string, dto: CreateApplicationDto) {
    const app = await this.getOwned(applicationId, technicianId);
    this.guard(app.status, 'RESUBMITTED');
    return this.prisma.verificationApplication.update({ where: { id: applicationId }, data: { status: 'RESUBMITTED', bio: dto.bio, experienceYears: dto.experienceYears, serviceCategories: dto.serviceCategories, serviceArea: dto.serviceArea, documentRefs: dto.documentRefs ?? [], updatedAt: new Date() } });
  }

  async reviewApplication(applicationId: string, adminId: string, dto: ReviewDecisionDto) {
    const app = await this.prisma.verificationApplication.findUnique({ where: { id: applicationId } });
    if (!app) throw new NotFoundException('APPLICATION_NOT_FOUND');
    this.guard(app.status, dto.decision);
    const updated = await this.prisma.verificationApplication.update({ where: { id: applicationId }, data: { status: dto.decision, reviewedAt: new Date() } });
    await this.prisma.reviewDecision.create({ data: { id: uuidv4(), applicationId, adminId, decision: dto.decision, reason: dto.reason } });
    await this.events.publishDecision(applicationId, app.technicianId, adminId, dto.decision, dto.reason);
    return updated;
  }

  async getApplication(applicationId: string) {
    const app = await this.prisma.verificationApplication.findUnique({ where: { id: applicationId }, include: { decisions: { orderBy: { createdAt: 'desc' } } } });
    if (!app) throw new NotFoundException('APPLICATION_NOT_FOUND');
    return app;
  }

  async getMyApplications(technicianId: string) {
    return this.prisma.verificationApplication.findMany({ where: { technicianId }, include: { decisions: { orderBy: { createdAt: 'desc' } } }, orderBy: { createdAt: 'desc' } });
  }

  async listPending() {
    return this.prisma.verificationApplication.findMany({ where: { status: { in: ['PENDING_REVIEW','RESUBMITTED'] } }, orderBy: { submittedAt: 'asc' } });
  }

  async checkEligibility(technicianId: string) {
    const app = await this.prisma.verificationApplication.findFirst({ where: { technicianId }, orderBy: { createdAt: 'desc' } });
    return { eligible: app?.status === 'APPROVED', status: app?.status ?? null };
  }

  private async getOwned(id: string, technicianId: string) {
    const app = await this.prisma.verificationApplication.findUnique({ where: { id } });
    if (!app) throw new NotFoundException('APPLICATION_NOT_FOUND');
    if (app.technicianId !== technicianId) throw new ForbiddenException('NOT_YOUR_APPLICATION');
    return app;
  }

  private guard(from: string, to: string) {
    if (!(ALLOWED[from] ?? []).includes(to)) throw new BadRequestException(`INVALID_TRANSITION: ${from} -> ${to}`);
  }
}
