export const BOOKING_EVENTS = {
  CREATED: 'booking.created',
  CANCELLED: 'booking.cancelled',
  ASSIGNED: 'booking.assigned',
  STATUS_CHANGED: 'booking.status_changed',
} as const;

export interface BookingCreatedEvent {
  eventId: string;
  eventType: typeof BOOKING_EVENTS.CREATED;
  eventVersion: '1.0';
  occurredAt: string;
  bookingId: string;
  customerId: string;
  serviceCategoryId: string;
}
