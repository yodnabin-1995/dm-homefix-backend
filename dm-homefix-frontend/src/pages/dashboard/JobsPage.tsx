import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobApi } from '../../lib/api'
import DashboardSidebar from '../../components/DashboardSidebar'
import StatusBadge from '../../components/StatusBadge'
import { formatDateTime } from '../../lib/utils'
import { Briefcase } from 'lucide-react'
import toast from 'react-hot-toast'

const NEXT: Record<string, string> = { ASSIGNED: 'TECHNICIAN_EN_ROUTE', TECHNICIAN_EN_ROUTE: 'IN_PROGRESS', IN_PROGRESS: 'COMPLETED' }
const NEXT_LABEL: Record<string, string> = { ASSIGNED: 'Mark En Route', TECHNICIAN_EN_ROUTE: 'Start Job', IN_PROGRESS: 'Complete Job' }

export default function JobsPage() {
  const qc = useQueryClient()
  const { data: jobs = [], isLoading } = useQuery({ queryKey: ['my-jobs'], queryFn: () => jobApi.get('/jobs/my').then(r => r.data) })
  const updateStatus = useMutation({
    mutationFn: ({ jobId, status }: { jobId: string; status: string }) => jobApi.patch(`/jobs/${jobId}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-jobs'] }); toast.success('Status updated') },
    onError: () => toast.error('Failed to update'),
  })
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
          <p className="text-gray-500 text-sm">Track and update your assigned jobs</p>
        </div>
        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24">
            <Briefcase className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No jobs yet</h3>
            <Link to="/dashboard/verification" className="mt-4 inline-block bg-primary-600 text-white font-semibold px-6 py-3 rounded-full text-sm">Complete Verification</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((j: { id: string; status: string; createdAt: string; completedAt?: string }) => (
              <div key={j.id} className="card flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="font-bold text-gray-900 text-sm">Job <span className="font-mono">#{j.id.slice(0, 8)}</span></p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatDateTime(j.createdAt)}</p>
                  {j.completedAt && <p className="text-xs text-green-600 mt-0.5">Completed: {formatDateTime(j.completedAt)}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={j.status} />
                  {NEXT[j.status] && (
                    <button onClick={() => updateStatus.mutate({ jobId: j.id, status: NEXT[j.status] })}
                      disabled={updateStatus.isPending}
                      className="text-xs bg-primary-600 hover:bg-primary-700 text-white font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-60">
                      {NEXT_LABEL[j.status]}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
