import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MockPaymentAdapter } from './adapters/mock-payment.adapter';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService, private adapter: MockPaymentAdapter) {}

  async initiate(dto: InitiatePaymentDto) {
    const { providerRef } = await this.adapter.initiatePayment(dto.bookingId, dto.amountMinorUnits, dto.currency);
    return this.prisma.payment.create({
      data: { id: uuidv4(), bookingId: dto.bookingId, amountMinorUnits: dto.amountMinorUnits, currency: dto.currency, status: 'INITIATED', providerRef },
    });
  }

  async getByBooking(bookingId: string) {
    return this.prisma.payment.findMany({ where: { bookingId }, orderBy: { createdAt: 'desc' } });
  }

  async getOne(id: string) {
    const p = await this.prisma.payment.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('PAYMENT_NOT_FOUND');
    return p;
  }

  async handleWebhook(payload: unknown) {
    const result = await this.adapter.processWebhook(payload);
    const payment = await this.prisma.payment.findFirst({ where: { providerRef: result.providerRef } });
    if (payment) {
      await this.prisma.payment.update({ where: { id: payment.id }, data: { status: result.status } });
    }
    return { received: true };
  }
}
