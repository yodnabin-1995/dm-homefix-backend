export const QUOTE_EVENTS = {
  SUBMITTED: 'quote.submitted',
  ACCEPTED: 'quote.accepted',
  DECLINED: 'quote.declined',
} as const;

export interface QuoteSubmittedEvent {
  eventId: string;
  eventType: typeof QUOTE_EVENTS.SUBMITTED;
  eventVersion: '1.0';
  occurredAt: string;
  quoteId: string;
  bookingId: string;
  technicianId: string;
  amountMinorUnits: number;
  currency: string;
}

export interface QuoteAcceptedEvent {
  eventId: string;
  eventType: typeof QUOTE_EVENTS.ACCEPTED;
  eventVersion: '1.0';
  occurredAt: string;
  quoteId: string;
  bookingId: string;
}
