import { useState } from 'react'
import DashboardSidebar from '../../components/DashboardSidebar'
import { Link } from 'react-router-dom'
import { Heart, MapPin, Star, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

// Favorites are stored locally (no backend endpoint yet)
// Users can save technicians they like
const STORAGE_KEY = 'dm_favorites'

interface FavTechnician {
  id: string
  name: string
  specialty: string
  rating: number
  reviews: number
  location: string
  rate: number
}

const sampleTechs: FavTechnician[] = [
  { id:'1', name:'Getachew Asrat',  specialty:'Plumber & Electrical',  rating:4.8, reviews:320, location:'Debre Markos', rate:300 },
  { id:'2', name:'Alemu Bekele',    specialty:'Electrical & Carpentry', rating:4.8, reviews:198, location:'Debre Markos', rate:300 },
  { id:'4', name:'Biniam Birhanu',  specialty:'AC Repair & Electrical', rating:4.9, reviews:412, location:'Debre Markos', rate:350 },
]

function getStoredFavs(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function storeFavs(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export default function FavoritesPage() {
  const [favIds, setFavIds] = useState<string[]>(() => {
    const stored = getStoredFavs()
    // If no stored favorites yet, show all samples as favorites by default
    return stored.length > 0 ? stored : sampleTechs.map(t => t.id)
  })

  const favorites = sampleTechs.filter(t => favIds.includes(t.id))

  function removeFavorite(id: string) {
    const updated = favIds.filter(f => f !== id)
    setFavIds(updated)
    storeFavs(updated)
    toast.success('Removed from favorites')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" /> Favorites
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Your saved technicians for quick booking</p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-24">
            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No favorites yet</h3>
            <p className="text-gray-500 text-sm mb-6">Save technicians you like for quick access</p>
            <Link to="/technicians" className="bg-primary-600 text-white font-semibold px-6 py-3 rounded-full text-sm">
              Find Technicians
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {favorites.map(tech => (
              <div key={tech.id} className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 hover:shadow-md transition-shadow">
                {/* Top */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-700 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                    {tech.name.split(' ').map(n => n[0]).join('')}
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
                  <button onClick={() => removeFavorite(tech.id)}
                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 group">
                    <Heart className="w-5 h-5 text-red-400 fill-red-400 group-hover:text-red-600" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{tech.location}</span>
                  <span className="font-semibold text-primary-600">ETB {tech.rate}/hr</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link to={`/technicians/${tech.id}`}
                    className="flex-1 text-center text-sm font-semibold text-primary-600 border border-primary-200 py-2 rounded-xl hover:bg-primary-50 transition-colors">
                    View Profile
                  </Link>
                  <Link to={`/book?technicianId=${tech.id}`}
                    className="flex-1 text-center text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-xl transition-colors">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {favorites.length > 0 && (
          <p className="text-xs text-gray-400 mt-6 text-center">
            Click the â¤ï¸ icon on any technician to remove from favorites.{' '}
            <Link to="/technicians" className="text-primary-600 hover:underline">Browse more technicians â†’</Link>
          </p>
        )}
      </main>
    </div>
  )
}

