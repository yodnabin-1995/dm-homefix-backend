import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Star } from 'lucide-react'

const reviews = [
  { id: 1, name: 'Tigist Alemu',  rating: 5, comment: 'Excellent service! The plumber arrived on time and fixed everything perfectly.',          service: 'Plumbing',   date: 'Nov 28, 2026' },
  { id: 2, name: 'Biruk Tesfaye', rating: 5, comment: 'Very professional electrician. Fixed our wiring issue quickly. Highly recommend!',       service: 'Electrical', date: 'Nov 25, 2026' },
  { id: 3, name: 'Marta Haile',   rating: 4, comment: 'Good painting job. Clean work and finished on schedule.',                               service: 'Painting',   date: 'Nov 22, 2026' },
  { id: 4, name: 'Daniel Girma',  rating: 5, comment: 'Amazing AC repair service. Fast, affordable and very polite technician.',               service: 'AC Repair',  date: 'Nov 20, 2026' },
  { id: 5, name: 'Hana Solomon',  rating: 5, comment: 'The cleaning team was thorough and professional. My house has never looked better!',     service: 'Cleaning',   date: 'Nov 18, 2026' },
  { id: 6, name: 'Yonas Kebede',  rating: 4, comment: 'Good carpentry work. The technician was skilled and finished on time.',                 service: 'Carpentry',  date: 'Nov 15, 2026' },
]

export default function ReviewsPage() {
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
  return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <main className="flex-1">
        <section className="relative min-h-[260px] flex items-center overflow-hidden">
          <img src="/images/background.png" alt="" className="absolute inset-0 w-full h-full object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-800/80 to-primary-700/20" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 w-full"><div className="max-w-xl text-white"><h1 className="text-4xl font-extrabold mb-2">Customer Reviews</h1><p className="text-white/80">See what our customers in Debre Markos say about DM HomeFix.</p></div></div>
        </section>
        <section className="py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="card mb-10 flex flex-col md:flex-row items-center gap-8">
              <div className="text-center">
                <p className="text-6xl font-extrabold text-primary-600">{avg}</p>
                <div className="flex items-center justify-center gap-0.5 my-2">{[1,2,3,4,5].map(i => <Star key={i} className={`w-6 h-6 ${i <= Math.round(Number(avg)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}</div>
                <p className="text-gray-500 text-sm">{reviews.length} verified reviews</p>
              </div>
              <div className="flex-1 w-full space-y-2">{[5,4,3,2,1].map(star => { const count = reviews.filter(r => r.rating === star).length; const pct = Math.round(count / reviews.length * 100); return (
                <div key={star} className="flex items-center gap-3"><span className="text-sm text-gray-600 w-4">{star}</span><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><div className="flex-1 bg-gray-200 rounded-full h-2"><div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500 w-8">{pct}%</span></div>
              )})}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map(r => (
                <div key={r.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">{r.name[0]}</div>
                    <div className="flex-1 min-w-0"><p className="font-bold text-gray-900 text-sm truncate">{r.name}</p><p className="text-xs text-gray-500">Customer</p></div>
                    <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">{r.service}</span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">{[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
                  <p className="text-xs text-gray-400 mt-3">{r.date}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
