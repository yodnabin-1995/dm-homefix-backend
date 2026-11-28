import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { Search, MapPin, Star, CheckCircle, Filter } from 'lucide-react'

const mockTechs = [
  { id: '1', name: 'Getachew Asrat',  specialty: 'Plumber & Electrical',  rating: 4.8, reviews: 320, rate: 300, available: true,  exp: 8  },
  { id: '2', name: 'Alemu Bekele',    specialty: 'Electrical & Carpentry', rating: 4.8, reviews: 198, rate: 300, available: true,  exp: 5  },
  { id: '3', name: 'Mekdes Tadesse',  specialty: 'Painter',               rating: 4.7, reviews: 145, rate: 250, available: false, exp: 4  },
  { id: '4', name: 'Biniam Birhanu',  specialty: 'AC Repair & Electrical', rating: 4.9, reviews: 412, rate: 350, available: true,  exp: 10 },
  { id: '5', name: 'Hana Girma',      specialty: 'Cleaning Services',      rating: 4.6, reviews: 89,  rate: 200, available: true,  exp: 3  },
  { id: '6', name: 'Solomon Desta',   specialty: 'Masonry & Carpentry',    rating: 4.7, reviews: 234, rate: 320, available: false, exp: 7  },
]
const cats = ['All', 'Plumbing', 'Electrical', 'Painting', 'Carpentry', 'Cleaning', 'AC Repair', 'Masonry']

export default function TechniciansPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative min-h-[300px] flex items-center overflow-hidden">
          <img src="/images/background.png" alt="" className="absolute inset-0 w-full h-full object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-800/80 to-primary-700/20" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 w-full">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl font-extrabold mb-2">Find a Technician</h1>
              <p className="text-white/80 mb-6">Search and connect with verified technicians near you in Debre Markos.</p>
              <div className="flex gap-2 max-w-xl bg-white rounded-2xl p-2 shadow-xl">
                <div className="flex items-center gap-2 flex-1 px-3">
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input type="text" placeholder="Search for services..." className="flex-1 text-sm outline-none text-gray-700 py-2 bg-transparent" />
                </div>
                <div className="flex items-center gap-1.5 px-3 border-l border-gray-100">
                  <MapPin className="w-4 h-4 text-primary-600" />Debre Markos
                </div>
                <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors">Search</button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-2 flex-wrap mb-6">
              {cats.map((cat, i) => (
                <button key={cat} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${i === 0 ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'}`}>{cat}</button>
              ))}
              <button className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-600">
                <Filter className="w-4 h-4" />Filters
              </button>
            </div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-600 text-sm font-medium">Available Technicians (<span className="text-primary-600 font-bold">{mockTechs.length}</span>)</p>
              <select className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 outline-none text-gray-600 bg-white">
                <option>Sort by: Best Match</option><option>Highest Rated</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {mockTechs.map(tech => (
                <div key={tech.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-700 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                        {tech.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {tech.available && <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-gray-900 truncate">{tech.name}</h3>
                        <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      </div>
                      <p className="text-sm text-gray-500 truncate">{tech.specialty}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-gray-800">{tech.rating}</span>
                        <span className="text-xs text-gray-400">({tech.reviews})</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-primary-600 font-bold text-sm">ETB {tech.rate}/hr</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tech.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {tech.available ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />Debre Markos</span>
                    <span>🔧 {tech.exp} yrs exp.</span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/technicians/${tech.id}`} className="flex-1 text-center text-sm font-semibold text-primary-600 border border-primary-200 py-2 rounded-xl hover:bg-primary-50 transition-colors">View Profile</Link>
                    <Link to={`/book?technicianId=${tech.id}`} className="flex-1 text-center text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-xl transition-colors">Book Now</Link>
                  </div>
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
