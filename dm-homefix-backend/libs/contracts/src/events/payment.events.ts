export const PAYMENT_EVENTS = {
  STATUS_CHANGED: 'payment.status_changed',
} as const;

export interface PaymentStatusChangedEvent {
  eventId: string;
  eventType: typeof PAYMENT_EVENTS.STATUS_CHANGED;
  eventVersion: '1.0';
  occurredAt: string;
  paymentId: string;
  bookingId: string;
  newStatus: string;
}
