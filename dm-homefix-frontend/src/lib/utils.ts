import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

export function formatCurrency(minor: number, currency = 'ETB') {
  return `${currency} ${(minor / 100).toLocaleString('en-ET')}`
}
export function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString('en-ET', { year:'numeric', month:'short', day:'numeric' })
}
export function formatDateTime(d: string | Date) {
  return new Date(d).toLocaleString('en-ET', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
}
export function timeAgo(d: string | Date) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s/60)}m ago`
  if (s < 86400) return `${Math.floor(s/3600)}h ago`
  return `${Math.floor(s/86400)}d ago`
}
export function getStatusClass(status: string) {
  const m: Record<string,string> = {
    PENDING:'badge-orange', CONFIRMED:'badge-blue', ASSIGNED:'badge-blue',
    IN_PROGRESS:'badge-blue', COMPLETED:'badge-green', CANCELLED:'badge-red',
    APPROVED:'badge-green', REJECTED:'badge-red', PENDING_REVIEW:'badge-orange',
    ACTIVE:'badge-green', SUSPENDED:'badge-red',
  }
  return m[status] ?? 'badge-gray'
}
