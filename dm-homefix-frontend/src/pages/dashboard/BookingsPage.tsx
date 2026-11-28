import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { bookingApi } from '../../lib/api'
import DashboardSidebar from '../../components/DashboardSidebar'
import StatusBadge from '../../components/StatusBadge'
import { formatDateTime } from '../../lib/utils'
import { CalendarCheck, Plus } from 'lucide-react'

export default function BookingsPage() {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingApi.get('/bookings').then(r => r.data),
  })
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-500 text-sm mt-0.5">Track and manage all your service requests</p>
          </div>
          <Link to="/book" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" /> New Booking
          </Link>
        </div>
        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24">
            <CalendarCheck className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings yet</h3>
            <Link to="/book" className="mt-4 inline-block bg-primary-600 text-white font-semibold px-6 py-3 rounded-full text-sm">Book a Service</Link>
          </div>
        ) : (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{['#','Service','Location','Scheduled','Status','Action'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map((b: { id: string; serviceCategoryId: string; location: string; preferredSchedule: string; status: string }, i: number) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-gray-400 text-xs font-mono">{i + 1}</td>
                      <td className="px-5 py-4 font-medium text-gray-800 max-w-[130px] truncate">{b.serviceCategoryId}</td>
                      <td className="px-5 py-4 text-gray-500 max-w-[130px] truncate">{b.location}</td>
                      <td className="px-5 py-4 text-gray-500 text-xs">{formatDateTime(b.preferredSchedule)}</td>
                      <td className="px-5 py-4"><StatusBadge status={b.status} /></td>
                      <td className="px-5 py-4">
                        <button className="text-xs text-primary-600 border border-primary-200 px-3 py-1.5 rounded-full hover:bg-primary-50 font-medium">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
