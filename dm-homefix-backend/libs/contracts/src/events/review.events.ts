export const REVIEW_EVENTS = {
  SUBMITTED: 'review.submitted',
  COMPLAINT_CREATED: 'complaint.created',
} as const;

export interface ReviewSubmittedEvent {
  eventId: string;
  eventType: typeof REVIEW_EVENTS.SUBMITTED;
  eventVersion: '1.0';
  occurredAt: string;
  reviewId: string;
  jobId: string;
  customerId: string;
  technicianId: string;
  rating: number;
}
