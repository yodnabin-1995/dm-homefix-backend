import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

/**
 * OTP Service — DEV MOCK
 * In development (OTP_CHANNEL=mock), OTPs are logged to the console.
 * For production, replace with SMS (e.g. Twilio/AfricasTalking) or email provider.
 */
@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(accountId: string, identifier: string): Promise<void> {
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate previous unused OTPs for this account
    await this.prisma.otpRecord.updateMany({
      where: { accountId, usedAt: null },
      data: { usedAt: new Date() },
    });

    await this.prisma.otpRecord.create({
      data: {
        id: uuidv4(),
        accountId,
        otp,
        expiresAt,
      },
    });

    const channel = this.config.get('OTP_CHANNEL', 'mock');
    if (channel === 'mock') {
      // DEV ONLY — do not use this in production
      this.logger.warn(
        `[DEV MOCK OTP] Account: ${accountId} | Identifier: ${identifier} | OTP: ${otp}`,
      );
    } else {
      // TODO: integrate real SMS/email provider here
      this.logger.warn(`OTP channel "${channel}" not yet implemented — OTP not sent`);
    }
  }

  async verifyOtp(accountId: string, otp: string): Promise<boolean> {
    const record = await this.prisma.otpRecord.findFirst({
      where: {
        accountId,
        otp,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) return false;

    await this.prisma.otpRecord.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    });

    return true;
  }
}
