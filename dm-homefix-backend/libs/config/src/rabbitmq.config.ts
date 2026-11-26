export const RABBITMQ_EXCHANGES = {
  DOMAIN_EVENTS: 'dm.homefix.events',
} as const;

export const RABBITMQ_QUEUES = {
  NOTIFICATION: 'notification.queue',
  BOOKING_EVENTS: 'booking.events.queue',
  JOB_EVENTS: 'job.events.queue',
  PAYMENT_EVENTS: 'payment.events.queue',
} as const;

export const RABBITMQ_ROUTING_KEYS = {
  ACCOUNT_CONTACT_VERIFIED: 'account.contact_verified',
  TECHNICIAN_APPROVED: 'technician_verification.approved',
  TECHNICIAN_REJECTED: 'technician_verification.rejected',
  BOOKING_CREATED: 'booking.created',
  BOOKING_CANCELLED: 'booking.cancelled',
  QUOTE_ACCEPTED: 'quote.accepted',
  JOB_STATUS_CHANGED: 'job.status_changed',
  PAYMENT_STATUS_CHANGED: 'payment.status_changed',
  REVIEW_SUBMITTED: 'review.submitted',
  COMPLAINT_CREATED: 'complaint.created',
} as const;
