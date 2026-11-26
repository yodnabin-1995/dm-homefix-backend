import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class QuoteService {
  constructor(private prisma: PrismaService) {}

  async createQuote(technicianId: string, dto: CreateQuoteDto) {
    return this.prisma.quote.create({
      data: { id: uuidv4(), bookingId: dto.bookingId, technicianId, amountMinorUnits: dto.amountMinorUnits, currency: dto.currency, description: dto.description, validUntil: new Date(dto.validUntil), terms: dto.terms, status: 'PENDING' },
    });
  }

  async getQuotesForBooking(bookingId: string) {
    return this.prisma.quote.findMany({ where: { bookingId }, orderBy: { createdAt: 'desc' } });
  }

  async getQuote(id: string) {
    const q = await this.prisma.quote.findUnique({ where: { id } });
    if (!q) throw new NotFoundException('QUOTE_NOT_FOUND');
    return q;
  }

  async acceptQuote(id: string, customerId: string) {
    const q = await this.getQuote(id);
    if (q.status !== 'PENDING') throw new BadRequestException('QUOTE_NOT_PENDING');
    if (new Date(q.validUntil) < new Date()) throw new BadRequestException('QUOTE_EXPIRED');
    // Decline all other quotes for same booking
    await this.prisma.quote.updateMany({ where: { bookingId: q.bookingId, id: { not: id } }, data: { status: 'DECLINED' } });
    return this.prisma.quote.update({ where: { id }, data: { status: 'ACCEPTED', acceptedAt: new Date() } });
  }

  async declineQuote(id: string, customerId: string) {
    const q = await this.getQuote(id);
    if (q.status !== 'PENDING') throw new BadRequestException('QUOTE_NOT_PENDING');
    return this.prisma.quote.update({ where: { id }, data: { status: 'DECLINED' } });
  }
}
