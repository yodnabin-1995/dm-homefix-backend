import { useQuery } from '@tanstack/react-query'
import { notifApi } from '../../lib/api'
import DashboardSidebar from '../../components/DashboardSidebar'
import { Bell } from 'lucide-react'
import { timeAgo } from '../../lib/utils'

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['my-notifications'],
    queryFn: () => notifApi.get('/notifications/my').then(r => r.data),
  })
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm mt-0.5">Stay updated with your service activity</p>
        </div>
        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-24">
            <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No notifications</h3>
            <p className="text-gray-500 text-sm">You are all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n: { id: string; subject: string; body: string; channel: string; language: string; createdAt: string }) => (
              <div key={n.id} className="card flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{n.subject}</p>
                  <p className="text-gray-600 text-sm mt-0.5">{n.body}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400">{timeAgo(n.createdAt)}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{n.channel}</span>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{n.language.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
