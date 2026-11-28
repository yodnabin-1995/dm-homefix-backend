import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { createTransport } from 'nodemailer';

/**
 * OTP Service
 *
 * Channels:
 *  - mock  : logs OTP to console (dev default, no email sent)
 *  - email : sends real email via SMTP
 *
 * To enable email OTP, add to .env:
 *   OTP_CHANNEL=email
 *   EMAIL_HOST=smtp.gmail.com
 *   EMAIL_PORT=587
 *   EMAIL_USER=your@gmail.com
 *   EMAIL_PASS=your_app_password
 *   EMAIL_FROM=DM HomeFix <your@gmail.com>
 *
 * Gmail setup:
 *   1. Enable 2-Step Verification at myaccount.google.com
 *   2. Go to Security → App passwords
 *   3. Create app password for "Mail"
 *   4. Use the 16-char password as EMAIL_PASS
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

    // Invalidate previous unused OTPs
    await this.prisma.otpRecord.updateMany({
      where: { accountId, usedAt: null },
      data: { usedAt: new Date() },
    });

    await this.prisma.otpRecord.create({
      data: { id: uuidv4(), accountId, otp, expiresAt },
    });

    const channel = this.config.get<string>('OTP_CHANNEL', 'mock');

    if (channel === 'email') {
      await this.sendEmailOtp(identifier, otp);
    } else {
      // DEV MOCK — always log to console
      this.logger.warn(
        `[DEV MOCK OTP] Account: ${accountId} | Identifier: ${identifier} | OTP: ${otp}`,
      );
    }
  }

  private async sendEmailOtp(to: string, otp: string): Promise<void> {
    const host = this.config.get<string>('EMAIL_HOST', 'smtp.gmail.com');
    const port = parseInt(this.config.get<string>('EMAIL_PORT', '587'), 10);
    const user = this.config.get<string>('EMAIL_USER');
    const pass = this.config.get<string>('EMAIL_PASS');
    const from = this.config.get<string>('EMAIL_FROM', 'DM HomeFix <noreply@dmhomefix.com>');

    if (!user || !pass) {
      this.logger.error('EMAIL_USER or EMAIL_PASS not configured. OTP not sent.');
      this.logger.warn(`[FALLBACK OTP] For ${to}: ${otp}`);
      return;
    }

    const transporter = createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="color:#1d4ed8;font-size:28px;font-weight:900;margin:0;">DM HomeFix</h1>
          <p style="color:#6b7280;font-size:13px;margin:4px 0 0;">Fix It Right. Live Better. — Debre Markos</p>
        </div>
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:16px;padding:32px;text-align:center;">
          <p style="color:#374151;font-size:16px;margin:0 0 20px;">Your verification code:</p>
          <div style="background:#1d4ed8;color:white;font-size:40px;font-weight:900;letter-spacing:14px;padding:20px 32px;border-radius:12px;display:inline-block;font-family:monospace;">
            ${otp}
          </div>
          <p style="color:#6b7280;font-size:14px;margin:20px 0 0;">
            ⏰ Expires in <strong>10 minutes</strong>
          </p>
          <p style="color:#9ca3af;font-size:12px;margin:12px 0 0;">
            If you did not register on DM HomeFix, please ignore this email.
          </p>
        </div>
        <p style="color:#9ca3af;font-size:11px;text-align:center;margin-top:24px;">
          © ${new Date().getFullYear()} DM HomeFix · Debre Markos, Ethiopia
        </p>
      </div>
    `;

    try {
      await transporter.sendMail({
        from,
        to,
        replyTo: from,
        subject: `Your DM HomeFix verification code: ${otp}`,
        html,
        text: `Your DM HomeFix verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not register on DM HomeFix, please ignore this email.\n\nDM HomeFix — Debre Markos, Ethiopia`,
      });
      this.logger.log(`✅ OTP email sent to: ${to}`);
    } catch (err) {
      this.logger.error(`❌ Failed to send OTP email to ${to}: ${err}`);
      // Log as fallback so user isn't stuck
      this.logger.warn(`[FALLBACK OTP] For ${to}: ${otp}`);
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
