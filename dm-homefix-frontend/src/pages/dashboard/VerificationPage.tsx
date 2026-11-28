import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tvApi } from '../../lib/api'
import { useAuthStore } from '../../store/authStore'
import DashboardSidebar from '../../components/DashboardSidebar'
import StatusBadge from '../../components/StatusBadge'
import { Shield, CheckCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function VerificationPage() {
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const [form, setForm] = useState({ bio: '', experienceYears: 0, serviceArea: '', serviceCategories: [''] })
  const [creating, setCreating] = useState(false)

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ['my-verification'],
    queryFn: () => tvApi.get('/verification/applications/my').then(r => r.data),
  })
  const { data: eligibility } = useQuery({
    queryKey: ['eligibility', user?.id],
    queryFn: () => tvApi.get(`/verification/eligibility/${user?.id}`).then(r => r.data),
    enabled: !!user?.id,
  })
  const submitApp = useMutation({
    mutationFn: (id: string) => tvApi.post(`/verification/applications/${id}/submit`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-verification'] }); toast.success('Submitted for review!') },
    onError: () => toast.error('Failed to submit'),
  })

  async function createDraft() {
    setCreating(true)
    try {
      await tvApi.post('/verification/applications', {
        bio: form.bio, experienceYears: Number(form.experienceYears),
        serviceCategories: form.serviceCategories.filter(Boolean),
        serviceArea: form.serviceArea, documentRefs: [],
      })
      qc.invalidateQueries({ queryKey: ['my-verification'] })
      toast.success('Draft created!')
    } catch { toast.error('Failed to create application') }
    finally { setCreating(false) }
  }

  const app = (apps as { id: string; status: string; bio: string; experienceYears: number; serviceArea: string; serviceCategories: string[]; decisions: { id: string; decision: string; reason?: string; createdAt: string }[] }[])[0]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto p-6 max-w-2xl">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-900">Verification</h1>
          <p className="text-gray-500 text-sm">Complete your verification to receive jobs</p>
        </div>
        {eligibility && (
          <div className={`card mb-5 flex items-center gap-4 border-l-4 ${eligibility.eligible ? 'border-green-500 bg-green-50' : 'border-orange-400 bg-orange-50'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${eligibility.eligible ? 'bg-green-100' : 'bg-orange-100'}`}>
              {eligibility.eligible ? <CheckCircle className="w-6 h-6 text-green-600" /> : <Shield className="w-6 h-6 text-orange-500" />}
            </div>
            <div>
              <p className={`font-bold text-sm ${eligibility.eligible ? 'text-green-800' : 'text-orange-800'}`}>
                {eligibility.eligible ? '✓ Verified & Eligible' : '⏳ Not Yet Eligible'}
              </p>
              <p className={`text-xs mt-0.5 ${eligibility.eligible ? 'text-green-700' : 'text-orange-700'}`}>
                Status: <strong>{eligibility.status || 'No application yet'}</strong>
              </p>
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
        ) : app ? (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2"><Shield className="w-5 h-5 text-primary-600" />Your Application</h2>
              <StatusBadge status={app.status} />
            </div>
            <div className="space-y-2 text-sm">
              {[['Bio', app.bio], ['Experience', `${app.experienceYears} years`], ['Service Area', app.serviceArea], ['Categories', app.serviceCategories?.join(', ')]].map(([l, v]) => (
                <div key={l as string} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500">{l as string}</span>
                  <span className="font-medium text-right max-w-[220px] text-xs">{v as string}</span>
                </div>
              ))}
            </div>
            {app.decisions?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                {app.decisions.map(d => (
                  <div key={d.id} className={`p-3 rounded-xl text-xs mt-2 ${d.decision === 'APPROVED' ? 'bg-green-50' : d.decision === 'REJECTED' ? 'bg-red-50' : 'bg-orange-50'}`}>
                    <p className="font-bold">{d.decision}</p>
                    {d.reason && <p className="text-gray-600 mt-1">{d.reason}</p>}
                  </div>
                ))}
              </div>
            )}
            {app.status === 'DRAFT' && (
              <button onClick={() => submitApp.mutate(app.id)} disabled={submitApp.isPending}
                className="mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                {submitApp.isPending && <Loader2 className="w-4 h-4 animate-spin" />}Submit for Review
              </button>
            )}
          </div>
        ) : (
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2"><Shield className="w-5 h-5 text-primary-600" />Create Verification Application</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Professional Bio</label>
                <textarea rows={3} className="input resize-none" placeholder="Describe your skills..." value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of Experience</label>
                  <input type="number" min={0} max={50} className="input" value={form.experienceYears} onChange={e => setForm(f => ({ ...f, experienceYears: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Area</label>
                  <input className="input" placeholder="e.g. Debre Markos" value={form.serviceArea} onChange={e => setForm(f => ({ ...f, serviceArea: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Category</label>
                <input className="input" placeholder="e.g. Plumbing" value={form.serviceCategories[0]} onChange={e => setForm(f => ({ ...f, serviceCategories: [e.target.value] }))} />
              </div>
              <button onClick={createDraft} disabled={creating || !form.bio || !form.serviceArea}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}Create Application Draft
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
