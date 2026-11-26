import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EventPublisherService {
  private readonly logger = new Logger(EventPublisherService.name);

  async publishSubmitted(applicationId: string, technicianId: string) {
    const event = { eventId: uuidv4(), eventType: 'technician_verification.submitted', eventVersion: '1.0', occurredAt: new Date().toISOString(), applicationId, technicianId };
    this.logger.log(`[EVENT] ${JSON.stringify(event)}`);
  }

  async publishDecision(applicationId: string, technicianId: string, adminId: string, decision: string, reason?: string) {
    const typeMap: Record<string,string> = { APPROVED: 'technician_verification.approved', REJECTED: 'technician_verification.rejected', INFORMATION_REQUESTED: 'technician_verification.information_requested' };
    const event = { eventId: uuidv4(), eventType: typeMap[decision] ?? `technician_verification.${decision.toLowerCase()}`, eventVersion: '1.0', occurredAt: new Date().toISOString(), applicationId, technicianId, adminId, reason };
    this.logger.log(`[EVENT] ${JSON.stringify(event)}`);
  }
}
