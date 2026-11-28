export interface User {
  id: string; email?: string; phone?: string
  firstName: string; lastName: string
  role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN'
  status: string; preferredLanguage: 'en' | 'am'
  serviceLocation?: string
  avatarUrl?: string
}
export interface Booking {
  id: string; customerId: string; technicianId?: string
  serviceCategoryId: string; problemDescription: string
  location: string; preferredSchedule: string; status: string
  createdAt: string; updatedAt: string
}
export interface Job {
  id: string; bookingId: string; technicianId: string
  status: string; completedAt?: string; createdAt: string
  statusHistory?: { id:string; fromStatus:string; toStatus:string; changedBy:string; createdAt:string }[]
}
export interface Notification {
  id: string; recipientId: string; channel: string
  language: string; subject: string; body: string
  status: string; createdAt: string
}
export interface VerificationApplication {
  id: string; technicianId: string; status: string
  bio: string; experienceYears: number
  serviceCategories: string[]; serviceArea: string
  documentRefs: string[]; submittedAt?: string; reviewedAt?: string
  decisions: { id:string; decision:string; reason?:string; adminId:string; createdAt:string }[]
}
