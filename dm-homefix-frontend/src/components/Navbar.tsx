import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, Globe, Phone, Menu, X, UserCircle } from 'lucide-react'
import Logo from './Logo'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  // All state at the top — before any JSX
  const [menuOpen, setMenuOpen]   = useState(false)
  const [userOpen, setUserOpen]   = useState(false)
  const [langOpen, setLangOpen]   = useState(false)
  const [lang,     setLang]       = useState('EN')

  const navLinks: [string, string][] = [
    ['/',            'Home'],
    ['/services',    'Services'],
    ['/technicians', 'Find a Technician'],
    ['/about',       'About'],
    ['/reviews',     'Reviews'],
    ['/contact',     'Contact'],
  ]

  return (
    <header className="w-full z-50 sticky top-0">

      {/* ── Top info bar ── */}
      <div className="bg-primary-800 text-white py-1.5 px-4 hidden md:flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
          Debre Markos, Ethiopia
        </span>
        <div className="flex items-center gap-4">
          <a href="tel:+251912345678" className="flex items-center gap-1 hover:text-orange-300 transition-colors">
            <Phone className="w-3 h-3" /> +251 91 234 5678
          </a>
          <span className="text-white/40">|</span>
          <Link to="/contact" className="hover:text-orange-300 transition-colors">Need Help?</Link>

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(o => !o)}
              className="flex items-center gap-1 border border-white/30 rounded px-2 py-0.5 hover:bg-white/10 transition-colors">
              <Globe className="w-3 h-3" /> {lang} <ChevronDown className="w-3 h-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-28 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                {[['EN', 'English'], ['AM', 'አማርኛ']].map(([code, label]) => (
                  <button key={code}
                    onClick={() => { setLang(code); setLangOpen(false) }}
                    className={`block w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors ${lang === code ? 'font-bold text-primary-600' : ''}`}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main navbar ── */}
      <nav className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-[60px] flex items-center justify-between gap-6">

          {/* Logo */}
          <Logo size="md" />

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium flex-1 justify-center">
            {navLinks.map(([href, label]) => (
              <Link key={href} to={href}
                className="px-3 py-1.5 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors font-medium whitespace-nowrap">
                {label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
                </button>
                <div className="relative">
                  <button onClick={() => setUserOpen(o => !o)}
                    className="flex items-center gap-2 hover:bg-gray-50 rounded-full px-3 py-1.5 transition-colors">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.firstName} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">{user?.firstName} {user?.lastName}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  {userOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <Link to="/dashboard"         onClick={() => setUserOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">Dashboard</Link>
                      <Link to="/dashboard/profile" onClick={() => setUserOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">Profile</Link>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={() => { logout(); navigate('/'); setUserOpen(false) }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/auth/login"
                  className="px-4 py-1.5 border border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-600 font-semibold rounded-full text-sm transition-all">
                  Login
                </Link>
                <Link to="/auth/register"
                  className="px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full text-sm transition-all flex items-center gap-1.5">
                  <UserCircle className="w-4 h-4" /> Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-gray-600" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white py-3 px-4 space-y-1">
            {navLinks.map(([href, label]) => (
              <Link key={href} to={href} onClick={() => setMenuOpen(false)}
                className="block py-2 px-3 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors">
                {label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="flex gap-2 pt-2 pb-1">
                <Link to="/auth/login" className="flex-1 text-center border border-gray-300 text-gray-700 py-2 rounded-full text-sm font-semibold">Login</Link>
                <Link to="/auth/register" className="flex-1 text-center bg-primary-600 text-white py-2 rounded-full text-sm font-semibold">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
