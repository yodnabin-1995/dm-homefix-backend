import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { bookingApi, catalogApi } from '../lib/api'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { CalendarCheck, MapPin, FileText, Loader2, ChevronRight, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const steps = ['Service', 'Details', 'Schedule', 'Confirm']
const fallbackCats = [
  { id: 'p',  name: 'Plumbing',         emoji: '🔧' }, { id: 'e',  name: 'Electrical',       emoji: '⚡' },
  { id: 'pa', name: 'Painting',          emoji: '🎨' }, { id: 'c',  name: 'Carpentry',         emoji: '🔨' },
  { id: 'cl', name: 'Cleaning',          emoji: '🧹' }, { id: 'ac', name: 'AC Repair',          emoji: '❄️' },
  { id: 'ap', name: 'Appliance Repair',  emoji: '📺' }, { id: 'm',  name: 'Masonry',            emoji: '🧱' },
]

export default function BookPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ serviceCategoryId: '', serviceName: '', problemDescription: '', location: '', preferredSchedule: '' })
  const [loading, setLoading] = useState(false)

  const { data: cats = [] } = useQuery({ queryKey: ['catalog'], queryFn: () => catalogApi.get('/catalog?lang=en').then(r => r.data) })
  const displayCats = cats.length > 0 ? cats.map((c: { id: string; name: string }) => ({ ...c, emoji: '🔧' })) : fallbackCats

  async function handleSubmit() {
    if (!isAuthenticated) { navigate('/auth/login'); return }
    setLoading(true)
    try {
      await bookingApi.post('/bookings', {
        serviceCategoryId: form.serviceCategoryId, problemDescription: form.problemDescription,
        location: form.location, preferredSchedule: new Date(form.preferredSchedule).toISOString(),
        idempotencyKey: `book-${Date.now()}`,
      })
      toast.success('Booking created!')
      navigate('/dashboard/bookings')
    } catch { toast.error('Failed to create booking') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative h-44 flex items-center overflow-hidden">
          <img src="/images/background.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 to-primary-700/60" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 w-full">
            <h1 className="text-3xl font-extrabold text-white mb-1">Book a Service</h1>
            <p className="text-white/75 text-sm">Schedule your home repair service easily.</p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Stepper */}
          <div className="flex items-center justify-center mb-10 gap-0">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${i === step ? 'bg-primary-600 text-white shadow-md' : i < step ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                  {i < step ? <CheckCircle className="w-4 h-4" /> : <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">{i + 1}</span>}
                  {s}
                </div>
                {i < steps.length - 1 && <div className={`h-0.5 w-8 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === 0 && (
                <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-primary-600" />Select Service</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {displayCats.map((cat: { id: string; name: string; emoji: string }) => (
                      <button key={cat.id} onClick={() => setForm(f => ({ ...f, serviceCategoryId: cat.id, serviceName: cat.name }))}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${form.serviceCategoryId === cat.id ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-100 hover:border-primary-200 text-gray-600'}`}>
                        <span className="text-2xl">{cat.emoji}</span>
                        <span className="text-xs font-semibold text-center leading-tight">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                  <button disabled={!form.serviceCategoryId} onClick={() => setStep(1)} className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-40">Continue <ChevronRight className="w-4 h-4" /></button>
                </div>
              )}
              {step === 1 && (
                <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-primary-600" />Service Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Describe the problem</label>
                      <textarea rows={4} className="input resize-none" placeholder="Describe your issue..." value={form.problemDescription} onChange={e => setForm(f => ({ ...f, problemDescription: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" />Location</label>
                      <input className="input" placeholder="e.g. Kebele 05, Debre Markos" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(0)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">Back</button>
                    <button disabled={!form.problemDescription || !form.location} onClick={() => setStep(2)} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-40">Continue <ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><CalendarCheck className="w-5 h-5 text-primary-600" />Choose Date & Time</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Schedule</label>
                    <input type="datetime-local" className="input" min={new Date().toISOString().slice(0, 16)} value={form.preferredSchedule} onChange={e => setForm(f => ({ ...f, preferredSchedule: e.target.value }))} />
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">Back</button>
                    <button disabled={!form.preferredSchedule} onClick={() => setStep(3)} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-40">Continue <ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" />Confirm Booking</h2>
                  <div className="space-y-3 mb-6">
                    {[['Service', form.serviceName], ['Problem', form.problemDescription], ['Location', form.location], ['Scheduled', form.preferredSchedule ? new Date(form.preferredSchedule).toLocaleString() : '']].map(([l, v]) => (
                      <div key={l as string} className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-sm text-gray-500">{l as string}</span>
                        <span className="text-sm font-medium text-gray-800 max-w-[200px] text-right">{v as string}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">Back</button>
                    <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />}{loading ? 'Booking...' : 'Confirm Booking →'}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {form.serviceName && (
                <div className="bg-white rounded-2xl shadow-card p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-900 text-sm mb-3 border-b border-gray-100 pb-2">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    {form.serviceName && <div className="flex justify-between"><span className="text-gray-500">Service</span><span className="font-medium">{form.serviceName}</span></div>}
                    {form.location && <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="font-medium text-xs text-right truncate max-w-[120px]">{form.location}</span></div>}
                  </div>
                </div>
              )}
              <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100">
                <h3 className="font-bold text-primary-800 text-sm mb-2">Why DM HomeFix?</h3>
                <ul className="space-y-2 text-xs text-primary-700">
                  {['Verified professionals only', 'Transparent pricing', 'Fast response', '24/7 support'].map(i => (
                    <li key={i} className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />{i}</li>
                  ))}
                </ul>
              </div>
              {!isAuthenticated && (
                <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 text-center">
                  <p className="text-sm text-orange-700 font-medium mb-3">Sign in to complete your booking</p>
                  <Link to="/auth/login" className="bg-orange-500 text-white text-sm font-semibold px-5 py-2 rounded-full inline-block">Login</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
