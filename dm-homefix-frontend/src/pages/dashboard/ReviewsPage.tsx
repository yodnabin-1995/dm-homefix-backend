import { useState } from 'react'
import DashboardSidebar from '../../components/DashboardSidebar'
import { useQuery } from '@tanstack/react-query'
import { reviewApi } from '../../lib/api'
import { useAuthStore } from '../../store/authStore'
import { Star, MessageSquare, Loader2, CheckCircle } from 'lucide-react'
import { formatDate } from '../../lib/utils'
import toast from 'react-hot-toast'

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(star => (
        <button key={star} type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}>
          <Star className={`w-6 h-6 transition-colors ${star <= (hover || value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
        </button>
      ))}
    </div>
  )
}

export default function DashboardReviewsPage() {
  const { user } = useAuthStore()
  const [form, setForm] = useState({ jobId: '', technicianId: '', rating: 0, comment: '' })
  const [submitting, setSubmitting] = useState(false)

  const { data: techReviews = [], isLoading } = useQuery({
    queryKey: ['reviews-about-me', user?.id],
    queryFn: () => reviewApi.get(`/reviews/technician/${user?.id}`).then(r => r.data),
    enabled: user?.role === 'TECHNICIAN' && !!user?.id,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.rating === 0) { toast.error('Please select a rating'); return }
    setSubmitting(true)
    try {
      await reviewApi.post('/reviews', {
        jobId: form.jobId,
        technicianId: form.technicianId,
        rating: form.rating,
        comment: form.comment,
      })
      toast.success('Review submitted!')
      setForm({ jobId: '', technicianId: '', rating: 0, comment: '' })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      if (msg === 'REVIEW_ALREADY_SUBMITTED') toast.error('You already reviewed this job.')
      else toast.error('Failed to submit review.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── TECHNICIAN VIEW ───────────────────────────────────────────────────────
  if (user?.role === 'TECHNICIAN') {
    const avg = techReviews.length
      ? (techReviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / techReviews.length).toFixed(1)
      : '—'
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
            <p className="text-gray-500 text-sm mt-0.5">Customer reviews about your work</p>
          </div>
          {techReviews.length > 0 && (
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 mb-6 flex items-center gap-6">
              <div className="text-center">
                <p className="text-5xl font-extrabold text-primary-600">{avg}</p>
                <StarRating value={Math.round(Number(avg))} />
                <p className="text-xs text-gray-500 mt-1">{techReviews.length} reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5,4,3,2,1].map(star => {
                  const count = techReviews.filter((r: { rating: number }) => r.rating === star).length
                  const pct = techReviews.length ? Math.round(count / techReviews.length * 100) : 0
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-4 text-gray-600">{star}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-7 text-gray-500">{pct}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {isLoading ? (
            <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : techReviews.length === 0 ? (
            <div className="text-center py-16">
              <Star className="w-14 h-14 text-gray-200 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">No reviews yet</h3>
              <p className="text-gray-500 text-sm">Complete jobs to start receiving reviews.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {techReviews.map((r: { id: string; rating: number; comment?: string; createdAt: string }) => (
                <div key={r.id} className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">C</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-800 text-sm">Customer</p>
                        <p className="text-xs text-gray-400">{formatDate(r.createdAt)}</p>
                      </div>
                      <StarRating value={r.rating} />
                      {r.comment && <p className="text-sm text-gray-600 mt-2">&ldquo;{r.comment}&rdquo;</p>}
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

  // ── CUSTOMER VIEW ─────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-500 text-sm mt-0.5">Rate your completed services</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Write a Review
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Job ID</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                  placeholder="Paste job ID from My Bookings"
                  value={form.jobId} onChange={e => setForm(f => ({ ...f, jobId: e.target.value.trim() }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Technician ID</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                  placeholder="Technician ID from your booking"
                  value={form.technicianId} onChange={e => setForm(f => ({ ...f, technicianId: e.target.value.trim() }))} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
              <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Comment (optional)</label>
              <textarea rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="Share your experience..."
                value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} />
            </div>
            <button type="submit" disabled={submitting || form.rating === 0}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-60">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5">
          <h3 className="font-bold text-primary-800 text-sm mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> How to find your Job ID and Technician ID
          </h3>
          <ol className="text-sm text-primary-700 space-y-1 list-decimal list-inside">
            <li>Go to <strong>My Bookings</strong> in the sidebar</li>
            <li>Find the completed booking you want to review</li>
            <li>Click <strong>View</strong> to see the full details</li>
            <li>Copy the Job ID and Technician ID from that page</li>
          </ol>
        </div>
      </main>
    </div>
  )
}
