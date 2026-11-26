import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { v4 as uuidv4 } from 'uuid';
import { firstValueFrom } from 'rxjs';

const CANCEL_ALLOWED = ['PENDING', 'CONFIRMED'];
const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

@Injectable()
export class BookingService {
  private readonly tvUrl: string;
  constructor(
    private prisma: PrismaService,
    private http: HttpService,
    private config: ConfigService,
  ) {
    this.tvUrl = config.get('TECHNICIAN_VERIFICATION_SERVICE_URL', 'http://localhost:3002');
  }

  async create(customerId: string, dto: CreateBookingDto) {
    if (dto.idempotencyKey) {
      const existing = await this.prisma.booking.findFirst({
        where: { idempotencyKey: dto.idempotencyKey, customerId },
      });
      if (existing) return existing;
    }
    return this.prisma.booking.create({
      data: {
        id: uuidv4(),
        customerId,
        serviceCategoryId: dto.serviceCategoryId,
        problemDescription: dto.problemDescription,
        location: dto.location,
        preferredSchedule: new Date(dto.preferredSchedule),
        status: 'PENDING',
        idempotencyKey: dto.idempotencyKey,
      },
    });
  }

  async findAll(customerId: string) {
    return this.prisma.booking.findMany({ where: { customerId }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string, userId: string, role: string) {
    const b = await this.prisma.booking.findUnique({ where: { id } });
    if (!b) throw new NotFoundException('BOOKING_NOT_FOUND');
    if (role === 'CUSTOMER' && b.customerId !== userId) throw new ForbiddenException();
    return b;
  }

  async cancel(id: string, customerId: string) {
    const b = await this.prisma.booking.findUnique({ where: { id } });
    if (!b) throw new NotFoundException('BOOKING_NOT_FOUND');
    if (b.customerId !== customerId) throw new ForbiddenException();
    if (!CANCEL_ALLOWED.includes(b.status))
      throw new BadRequestException(`Cannot cancel booking in status: ${b.status}`);
    return this.prisma.booking.update({ where: { id }, data: { status: 'CANCELLED' } });
  }

  async assignTechnician(bookingId: string, technicianId: string) {
    const b = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!b) throw new NotFoundException('BOOKING_NOT_FOUND');
    // Verify technician eligibility
    try {
      const res = await firstValueFrom(
        this.http.get(`${this.tvUrl}/api/v1/verification/eligibility/${technicianId}`),
      );
      if (!res.data?.eligible) throw new BadRequestException('TECHNICIAN_NOT_ELIGIBLE');
    } catch (e: unknown) {
      if (e instanceof BadRequestException) throw e;
      throw new BadRequestException('CANNOT_VERIFY_TECHNICIAN_ELIGIBILITY');
    }
    if (!VALID_TRANSITIONS[b.status]?.includes('ASSIGNED'))
      throw new BadRequestException(`INVALID_TRANSITION: ${b.status} -> ASSIGNED`);
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'ASSIGNED', technicianId },
    });
  }

  async adminList() {
    return this.prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
