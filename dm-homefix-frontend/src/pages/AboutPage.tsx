import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { CheckCircle, Users, Star, Clock, Shield, Zap, Headphones } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <main className="flex-1">
        <section className="relative min-h-[300px] flex items-center overflow-hidden">
          <img src="/images/background.png" alt="" className="absolute inset-0 w-full h-full object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-800/80 to-primary-700/20" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 w-full">
            <div className="max-w-2xl text-white"><h1 className="text-4xl font-extrabold mb-2">About DM HomeFix</h1><p className="text-white/80 text-lg">Professional home repair services for a better living in Debre Markos, Ethiopia.</p></div>
          </div>
        </section>
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">DM HomeFix connects homeowners in Debre Markos with skilled, verified local technicians. We believe everyone deserves fast, reliable, and affordable home repair services.</p>
                <ul className="space-y-3 mb-8">{['All technicians are background-checked and verified', 'Transparent pricing with no hidden fees', 'Fast response — most bookings confirmed within 1 hour', 'Available 24/7 customer support in Amharic and English'].map(item => (
                  <li key={item} className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><span className="text-gray-700 text-sm">{item}</span></li>
                ))}</ul>
                <div className="grid grid-cols-3 gap-4">{[{ icon: Users, v: '10,000+', l: 'Customers' }, { icon: Star, v: '98%', l: 'Satisfaction' }, { icon: Clock, v: '< 1 Hour', l: 'Response' }].map(({ icon: Icon, v, l }) => (
                  <div key={l} className="text-center p-4 bg-primary-50 rounded-2xl"><Icon className="w-5 h-5 text-primary-600 mx-auto mb-2" /><p className="text-xl font-bold text-primary-700">{v}</p><p className="text-xs text-gray-500 mt-0.5">{l}</p></div>
                ))}</div>
              </div>
              <div className="relative rounded-3xl overflow-hidden h-80 shadow-xl">
                <img src="/images/background.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary-900/65" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
                  <h3 className="text-2xl font-bold mb-4">Fix It Right. Live Better.</h3>
                  <div className="grid grid-cols-3 gap-4 w-full">{[['10K+', 'Customers'], ['98%', 'Satisfaction'], ['500+', 'Technicians']].map(([v, l]) => <div key={l}><p className="text-2xl font-bold text-orange-400">{v}</p><p className="text-xs text-white/70 mt-1">{l}</p></div>)}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Why Choose DM HomeFix?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">{[{ icon: Shield, title: 'Verified Pros', desc: 'Background-checked technicians' }, { icon: Zap, title: 'Fast Service', desc: 'Quick response every time' }, { icon: Star, title: 'Quality Work', desc: '98% customer satisfaction' }, { icon: Headphones, title: '24/7 Support', desc: 'Help in EN & Amharic' }].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card text-center hover:shadow-md transition-shadow"><div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3"><Icon className="w-6 h-6 text-primary-600" /></div><h3 className="font-bold text-gray-900 mb-1">{title}</h3><p className="text-xs text-gray-500">{desc}</p></div>
            ))}</div>
          </div>
        </section>
        <section className="relative py-14 overflow-hidden">
          <img src="/images/background.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary-800/88" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-3">Ready to get started?</h2>
            <p className="text-white/75 mb-6">Join thousands of satisfied customers in Debre Markos.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/book" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full transition-colors">Book a Service</Link>
              <Link to="/auth/register" className="bg-white/15 hover:bg-white/25 text-white font-bold px-8 py-3.5 rounded-full border border-white/30 transition-colors">Create Account</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
