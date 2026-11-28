import { useState } from 'react'
import DashboardSidebar from '../../components/DashboardSidebar'
import { Headphones, Mail, Phone, MessageSquare, ChevronDown, ChevronUp, Loader2, Send } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const faqs = [
  { q: 'How do I book a service?',
    a: 'Click "Book a Service" from your dashboard or sidebar. Choose your service, describe the problem, pick a date, and confirm.' },
  { q: 'How are technicians verified?',
    a: 'All technicians go through a background check and document review by our admin team before they can receive jobs.' },
  { q: 'Can I cancel a booking?',
    a: 'Yes — bookings in PENDING or CONFIRMED status can be cancelled from your Bookings page.' },
  { q: 'How do I pay for a service?',
    a: 'Payment is handled after job completion. We support multiple payment methods including mobile money.' },
  { q: 'What if the technician does not show up?',
    a: 'Contact support immediately. We will reschedule at no extra cost or give you a full refund.' },
  { q: 'How do I leave a review?',
    a: 'After a job is marked COMPLETED, go to the job details and submit your rating and review.' },
  { q: 'Can I change my preferred language?',
    a: 'Yes — go to Settings and choose between English and Amharic (አማርኛ).' },
]

export default function SupportPage() {
  const { user } = useAuthStore()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [form, setForm] = useState({ subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    toast.success('Support ticket submitted! We will respond within 24 hours.', { duration: 5000 })
    setForm({ subject: '', message: '' })
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Headphones className="w-6 h-6 text-primary-600" /> Help & Support
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">We are here to help you 24/7</p>
        </div>

        {/* Quick contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Phone,         label: 'Call Us',    value: '+251 91 234 5678',   sub: 'Mon–Sat 8AM–8PM',      color: 'bg-primary-50 text-primary-600' },
            { icon: Mail,          label: 'Email Us',   value: 'support@dmhomefix.com', sub: 'Reply within 24h', color: 'bg-orange-50 text-orange-600'  },
            { icon: MessageSquare, label: 'Live Chat',  value: 'Start a chat',       sub: 'Available 8AM–8PM',    color: 'bg-green-50 text-green-600'   },
          ].map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{label}</p>
                <p className="text-gray-700 text-sm">{value}</p>
                <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FAQ */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary-600" /> Frequently Asked Questions
            </h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-semibold text-gray-800 pr-4">{faq.q}</span>
                    {openFaq === i
                      ? <ChevronUp className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    }
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 bg-primary-50/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Support ticket form */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary-600" /> Submit a Support Ticket
            </h2>
            {/* Pre-filled user info */}
            {user && (
              <div className="bg-primary-50 rounded-xl p-3 mb-4 text-xs text-primary-700">
                <span className="font-semibold">Submitting as:</span> {user.firstName} {user.lastName} ({user.email})
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  placeholder="Briefly describe your issue"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white resize-none"
                  placeholder="Describe your issue in detail..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  required
                />
              </div>
              <button type="submit" disabled={loading}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-colors disabled:opacity-60">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
