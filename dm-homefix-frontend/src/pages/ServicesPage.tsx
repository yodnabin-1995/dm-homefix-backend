import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { catalogApi } from '../lib/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Search, ChevronRight, Droplets, Zap, Paintbrush, Hammer, Wind, Sparkles, Tv, Layers, MoreHorizontal } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Plumbing: Droplets, Electrical: Zap, Painting: Paintbrush, Carpentry: Hammer,
  'AC Repair': Wind, Cleaning: Sparkles, 'Appliance Repair': Tv, Masonry: Layers,
}
const colorMap: Record<string, string> = {
  Plumbing: 'bg-blue-50 text-blue-600', Electrical: 'bg-yellow-50 text-yellow-600',
  Painting: 'bg-pink-50 text-pink-600', Carpentry: 'bg-orange-50 text-orange-600',
  'AC Repair': 'bg-cyan-50 text-cyan-600', Cleaning: 'bg-green-50 text-green-600',
  'Appliance Repair': 'bg-purple-50 text-purple-600', Masonry: 'bg-red-50 text-red-600',
}
const fallback = [
  { id: '1', name: 'Plumbing', description: 'Fix leaks & pipes' },
  { id: '2', name: 'Electrical', description: 'Safe & reliable' },
  { id: '3', name: 'Painting', description: 'Fresh new look' },
  { id: '4', name: 'Carpentry', description: 'Build & repair' },
  { id: '5', name: 'Cleaning', description: 'Clean & healthy' },
  { id: '6', name: 'Appliance Repair', description: 'Fix appliances' },
  { id: '7', name: 'Masonry', description: 'Build stronger' },
  { id: '8', name: 'AC Repair', description: 'Stay cool' },
]

export default function ServicesPage() {
  const { data: cats = [], isLoading } = useQuery({ queryKey: ['catalog'], queryFn: () => catalogApi.get('/catalog?lang=en').then(r => r.data) })
  const display = cats.length > 0 ? cats : fallback

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative min-h-[380px] flex items-center overflow-hidden">
          <img src="/images/background.png" alt="" className="absolute inset-0 w-full h-full object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-800/80 to-primary-700/20" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 w-full">
            <div className="max-w-2xl text-white">
              <p className="text-orange-400 font-medium text-sm mb-2">Home › Services</p>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Our Services</h1>
              <p className="text-orange-400 font-bold text-xl mb-2">Professional Home Services in Debre Markos</p>
              <p className="text-white/80 mb-6">Professional home services for a better living.</p>
              <div className="flex gap-2 max-w-lg bg-white rounded-2xl p-2 shadow-xl">
                <div className="flex items-center gap-2 flex-1 px-3">
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input type="text" placeholder="Search services..." className="flex-1 text-sm outline-none text-gray-700 py-2 bg-transparent" />
                </div>
                <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors">Search</button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-6 bg-primary-600 rounded-full" />
                  <h2 className="text-2xl font-bold text-gray-900">Service Categories</h2>
                </div>
                <p className="text-gray-500 text-sm ml-3">Professional home services for a better living.</p>
              </div>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {display.map((cat: { id: string; name: string; description?: string }) => {
                  const Icon = iconMap[cat.name] || MoreHorizontal
                  const color = colorMap[cat.name] || 'bg-gray-50 text-gray-600'
                  return (
                    <Link key={cat.id} to={`/technicians?service=${encodeURIComponent(cat.name)}`}
                      className="group border border-gray-100 rounded-2xl p-5 hover:border-primary-200 hover:shadow-card transition-all bg-white">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">{cat.name}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-3">{cat.description || 'Professional service'}</p>
                      <span className="text-xs text-primary-600 font-semibold flex items-center gap-1">Learn More <ChevronRight className="w-3 h-3" /></span>
                    </Link>
                  )
                })}
              </div>
            )}

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 bg-primary-50 rounded-2xl overflow-hidden">
              {[
                { label: 'Verified Professionals', sub: 'Background-checked technicians' },
                { label: 'Affordable Prices', sub: 'Quality service at fair prices' },
                { label: 'Satisfaction Guaranteed', sub: 'Your happiness is our priority' },
                { label: '24/7 Support', sub: "We're here to help anytime" },
              ].map(({ label, sub }) => (
                <div key={label} className="flex items-center gap-3 p-5">
                  <span className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">✓</span>
                  <div><p className="text-sm font-semibold text-gray-800">{label}</p><p className="text-xs text-gray-500">{sub}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-12 overflow-hidden">
          <img src="/images/background.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary-800/88" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
            <div>
              <h2 className="text-2xl font-bold mb-1">Need a different service?</h2>
              <p className="text-white/75 text-sm">Contact us for any home repair needs.</p>
            </div>
            <Link to="/contact" className="bg-orange-500 hover:bg-orange-600 text-white font-bold whitespace-nowrap px-8 py-3.5 rounded-full transition-colors shadow-lg">Contact Us →</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
