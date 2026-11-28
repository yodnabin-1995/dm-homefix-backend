import { getStatusClass } from '../lib/utils'
const LABELS: Record<string,string> = {
  PENDING:'Pending',CONFIRMED:'Confirmed',ASSIGNED:'Assigned',IN_PROGRESS:'In Progress',
  COMPLETED:'Completed',CANCELLED:'Cancelled',APPROVED:'Approved',REJECTED:'Rejected',
  PENDING_REVIEW:'Pending Review',INFORMATION_REQUESTED:'Info Requested',
  ACTIVE:'Active',SUSPENDED:'Suspended',OPEN:'Open',RESOLVED:'Resolved',
}
export default function StatusBadge({ status }: { status: string }) {
  return <span className={getStatusClass(status)}>{LABELS[status] ?? status}</span>
}
