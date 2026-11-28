import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Phone, Mail, MapPin, Clock, Send, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Message sent! We will get back to you within 24 hours.')
    setForm({ name: '', email: '', subject: '', message: '' }); setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <main className="flex-1">
        <section className="relative min-h-[260px] flex items-center overflow-hidden">
          <img src="/images/background.png" alt="" className="absolute inset-0 w-full h-full object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-800/80 to-primary-700/20" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 w-full"><div className="max-w-xl text-white"><h1 className="text-4xl font-extrabold mb-2">Contact Us</h1><p className="text-white/80">We are here to help. Reach out to us any time.</p></div></div>
        </section>
        <section className="py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="space-y-5">
                {[{ icon: Phone, title: 'Phone', value: '+251 91 234 5678', sub: 'Mon–Sat 8AM–8PM' }, { icon: Mail, title: 'Email', value: 'info@dmhomefix.com', sub: 'Reply within 24 hours' }, { icon: MapPin, title: 'Location', value: 'Debre Markos, Ethiopia', sub: 'Amhara Region' }, { icon: Clock, title: 'Hours', value: 'Mon–Sat: 8AM–8PM', sub: 'Sun: 9AM–5PM' }].map(({ icon: Icon, title, value, sub }) => (
                  <div key={title} className="card flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0"><Icon className="w-5 h-5 text-primary-600" /></div>
                    <div><p className="font-bold text-gray-900 text-sm">{title}</p><p className="text-gray-700 text-sm">{value}</p><p className="text-gray-400 text-xs mt-0.5">{sub}</p></div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-2 card">
                <h2 className="font-bold text-gray-900 text-lg mb-5">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label><input className="input" placeholder="Abebe Kebede" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label><input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label><input className="input" placeholder="How can we help?" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label><textarea rows={5} className="input resize-none" placeholder="Describe your issue..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required /></div>
                  <button type="submit" disabled={loading} className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-60">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}{loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
