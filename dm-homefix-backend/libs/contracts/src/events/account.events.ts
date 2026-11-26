export const ACCOUNT_EVENTS = {
  CONTACT_VERIFIED: 'account.contact_verified',
  REGISTERED: 'account.registered',
} as const;

export interface AccountContactVerifiedEvent {
  eventId: string;
  eventType: typeof ACCOUNT_EVENTS.CONTACT_VERIFIED;
  eventVersion: '1.0';
  occurredAt: string;
  accountId: string;
  email?: string;
  phone?: string;
}
