import { Injectable, Logger } from '@nestjs/common';
/**
 * MOCK NOTIFICATION ADAPTER — DEV ONLY
 * Logs notifications to console. Replace with real SMS/email provider for production.
 */
@Injectable()
export class MockNotificationAdapter {
  private readonly logger = new Logger(MockNotificationAdapter.name);
  async send(recipientId: string, channel: string, language: string, subject: string, body: string): Promise<void> {
    this.logger.warn(`[DEV MOCK NOTIFICATION] To: ${recipientId} | Channel: ${channel} | Lang: ${language} | Subject: ${subject} | Body: ${body}`);
  }
}
