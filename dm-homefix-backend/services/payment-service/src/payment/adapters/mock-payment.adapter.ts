import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

/**
 * MOCK PAYMENT ADAPTER — DEV ONLY
 * Always returns a successful payment reference.
 * Replace with a real provider adapter (e.g. Chapa) before production.
 */
@Injectable()
export class MockPaymentAdapter {
  private readonly logger = new Logger(MockPaymentAdapter.name);

  async initiatePayment(
    bookingId: string,
    amountMinorUnits: number,
    currency: string,
  ): Promise<{ providerRef: string }> {
    const ref = `MOCK-${uuidv4()}`;
    this.logger.warn(
      `[DEV MOCK PAYMENT] Booking: ${bookingId} | Amount: ${amountMinorUnits} ${currency} | Ref: ${ref}`,
    );
    return { providerRef: ref };
  }

  async processWebhook(payload: unknown): Promise<{ status: string; providerRef: string }> {
    this.logger.warn(`[DEV MOCK WEBHOOK] ${JSON.stringify(payload)}`);
    return { status: 'SUCCESSFUL', providerRef: 'MOCK-WEBHOOK-REF' };
  }
}
