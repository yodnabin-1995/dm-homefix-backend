export const TECHNICIAN_VERIFICATION_EVENTS = {
  SUBMITTED: 'technician_verification.submitted',
  APPROVED: 'technician_verification.approved',
  REJECTED: 'technician_verification.rejected',
  INFORMATION_REQUESTED: 'technician_verification.information_requested',
} as const;

export interface TechnicianVerificationSubmittedEvent {
  eventId: string;
  eventType: typeof TECHNICIAN_VERIFICATION_EVENTS.SUBMITTED;
  eventVersion: '1.0';
  occurredAt: string;
  applicationId: string;
  technicianId: string;
}

export interface TechnicianVerificationDecisionEvent {
  eventId: string;
  eventType: string;
  eventVersion: '1.0';
  occurredAt: string;
  applicationId: string;
  technicianId: string;
  adminId: string;
  reason?: string;
}
