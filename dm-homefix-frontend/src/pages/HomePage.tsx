import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Shield, Zap, Wallet, Star, Headphones, ChevronDown, ChevronRight, Droplets, Zap as ZapIcon, Paintbrush, Hammer, Wind, Sparkles, Tv, Layers } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const services = [
  { icon: Droplets,   name: 'Plumbing',          desc: 'Fix leaks & pipes',  color:'bg-blue-100 text-blue-600'   },
  { icon: ZapIcon,    name: 'Electrical',         desc: 'Safe & reliable',    color:'bg-yellow-100 text-yellow-600'},
  { icon: Paintbrush, name: 'Painting',           desc: 'Fresh new look',     color:'bg-pink-100 text-pink-600'   },
  { icon: Hammer,     name: 'Carpentry',          desc: 'Build & repair',     color:'bg-orange-100 text-orange-600'},
  { icon: Wind,       name: 'AC Repair',          desc: 'Stay cool',          color:'bg-cyan-100 text-cyan-600'   },
  { icon: Sparkles,   name: 'Cleaning',           desc: 'Clean & healthy',    color:'bg-green-100 text-green-600' },
  { icon: Tv,         name: 'Appliance Repair',   desc: 'Fix appliances',     color:'bg-purple-100 text-purple-600'},
  { icon: Layers,     name: 'Masonry',            desc: 'Build stronger',     color:'bg-red-100 text-red-600'     },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('Debre Markos')
  const [locationOpen, setLocationOpen] = useState(false)

  const locations = ['Debre Markos', 'Debre Markos Town', 'Kebele 01', 'Kebele 03', 'Kebele 05', 'Kebele 07']

  function handleSearch() {
    if (searchQuery.trim()) navigate(`/technicians?service=${encodeURIComponent(searchQuery)}`)
    else navigate('/services')
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="relative min-h-[520px] flex items-center overflow-hidden">
          <img src="/images/background.png" alt="DM HomeFix" className="absolute inset-0 w-full h-full object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
                Debre Markos&apos;s Trusted<br />
                <span className="text-primary-600">Home Repair</span> Marketplace
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                Connect with verified local technicians for any home service.<br />
                Fast, reliable and affordable.
              </p>
              {/* Search bar */}
              <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-2xl p-2 shadow-xl border border-gray-100 max-w-lg">
                <div className="flex items-center gap-2 flex-1 px-3">
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="Search for services (e.g. plumbing, electrical...)"
                    className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 py-2 bg-transparent"
                  />
                </div>
                {/* Location dropdown */}
                <div className="relative border-l border-gray-200 flex-shrink-0">
                  <button
                    onClick={() => setLocationOpen(!locationOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 hover:bg-gray-50 rounded-r-xl transition-colors min-w-[130px]">
                    <MapPin className="w-4 h-4 text-primary-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700 font-medium truncate">{location}</span>
                    <ChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  </button>
                  {locationOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      {locations.map(loc => (
                        <button key={loc} onClick={() => { setLocation(loc); setLocationOpen(false) }}
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-primary-50 hover:text-primary-600 transition-colors ${location === loc ? 'text-primary-600 font-semibold' : 'text-gray-700'}`}>
                          <span className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> {loc}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors whitespace-nowrap">
                  Search →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUST BADGES ─────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-gray-100">
              {[
                { icon: Shield,      label: 'Verified Technicians'      },
                { icon: Zap,         label: 'Fast & Reliable Service'   },
                { icon: Wallet,      label: 'Secure Payments'           },
                { icon: Star,        label: 'Top Rated Professionals'   },
                { icon: Headphones,  label: '24/7 Support'              },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 px-6 py-4">
                  <Icon className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-gray-700">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── OUR SERVICES ─────────────────────────────────────────── */}
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Our Services</h2>
              <p className="text-gray-500 text-sm">Professional home services for a better living.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
              {services.slice(0, 5).map(svc => {
                const Icon = svc.icon
                return (
                  <Link key={svc.name} to={`/services`}
                    className="group flex items-center gap-3 p-4 border border-gray-100 rounded-2xl hover:border-primary-200 hover:shadow-card transition-all bg-white">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${svc.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-primary-600 transition-colors truncate">{svc.name}</p>
                      <p className="text-xs text-gray-400 truncate">{svc.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 flex-shrink-0 ml-auto" />
                  </Link>
                )
              })}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {services.slice(5, 7).map(svc => {
                const Icon = svc.icon
                return (
                  <Link key={svc.name} to="/services"
                    className="group flex items-center gap-3 p-4 border border-gray-100 rounded-2xl hover:border-primary-200 hover:shadow-card transition-all bg-white">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${svc.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-primary-600 transition-colors truncate">{svc.name}</p>
                      <p className="text-xs text-gray-400 truncate">{svc.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 ml-auto" />
                  </Link>
                )
              })}
              {/* Need Help card */}
              <div className="relative rounded-2xl overflow-hidden col-span-2 lg:col-span-2 min-h-[80px]">
                <img src="/images/background.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary-700/85" />
                <div className="relative z-10 p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-white">
                    <p className="font-bold text-lg">Need Help?</p>
                    <p className="text-white/75 text-xs">Our support team is here to help you 24/7.</p>
                  </div>
                  <Link to="/contact" className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-colors">
                    Contact Us →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ────────────────────────────────────────── */}
        <section className="py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-10">Why Choose DM HomeFix?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Shield,     title:'Verified Professionals', sub:'Background-checked technicians'      },
                { icon: Zap,        title:'Fast & Reliable',        sub:'Quick response every time'           },
                { icon: Wallet,     title:'Transparent Pricing',    sub:'No hidden fees'                     },
                { icon: Star,       title:'Quality Guaranteed',     sub:'98% customer satisfaction'          },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="card text-center hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">{title}</h3>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ───────────────────────────────────────────── */}
        <section className="relative py-14 overflow-hidden">
          <img src="/images/background.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary-800/88" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1">Need help? Book a service today!</h2>
              <p className="text-white/75 text-sm">Get your home fixed by trusted professionals in Debre Markos.</p>
            </div>
            <Link to="/book" className="bg-orange-500 hover:bg-orange-600 text-white font-bold whitespace-nowrap text-base px-10 py-3.5 rounded-full transition-colors shadow-lg">
              Book Now →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
