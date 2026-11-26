export const JOB_EVENTS = {
  STATUS_CHANGED: 'job.status_changed',
  COMPLETED: 'job.completed',
} as const;

export interface JobStatusChangedEvent {
  eventId: string;
  eventType: typeof JOB_EVENTS.STATUS_CHANGED;
  eventVersion: '1.0';
  occurredAt: string;
  jobId: string;
  bookingId: string;
  technicianId: string;
  newStatus: string;
}
