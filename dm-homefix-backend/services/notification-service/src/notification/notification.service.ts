import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MockNotificationAdapter } from './adapters/mock-notification.adapter';
import { SendNotificationDto } from './dto/send-notification.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private adapter: MockNotificationAdapter,
  ) {}

  async send(dto: SendNotificationDto) {
    await this.adapter.send(dto.recipientId, dto.channel, dto.language, dto.subject, dto.body);
    return this.prisma.notification.create({
      data: {
        id: uuidv4(),
        recipientId: dto.recipientId,
        channel: dto.channel,
        language: dto.language,
        subject: dto.subject,
        body: dto.body,
        status: 'SENT',
      },
    });
  }

  async getForRecipient(recipientId: string) {
    return this.prisma.notification.findMany({
      where: { recipientId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
