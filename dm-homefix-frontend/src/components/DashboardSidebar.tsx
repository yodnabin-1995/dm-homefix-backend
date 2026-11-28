'use client'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, CalendarCheck, User, Bell, HelpCircle,
  Settings, LogOut, Briefcase, DollarSign, Star, Shield,
  Heart, Headphones,
} from 'lucide-react'
import Logo from './Logo'
import { useAuthStore } from '../store/authStore'

const customerLinks = [
  { to: '/dashboard',               icon: LayoutDashboard, label: 'Dashboard'      },
  { to: '/dashboard/bookings',      icon: CalendarCheck,   label: 'My Bookings'    },
  { to: '/dashboard/profile',       icon: User,            label: 'My Profile'     },
  { to: '/dashboard/favorites',     icon: Heart,           label: 'Favorites'      },
  { to: '/dashboard/notifications', icon: Bell,            label: 'Notifications', badge: 2 },
  { to: '/dashboard/support',       icon: HelpCircle,      label: 'Support'        },
  { to: '/dashboard/settings',      icon: Settings,        label: 'Settings'       },
]

const technicianLinks = [
  { to: '/dashboard',               icon: LayoutDashboard, label: 'Dashboard'      },
  { to: '/dashboard/jobs',          icon: Briefcase,       label: 'My Jobs'        },
  { to: '/dashboard/verification',  icon: Shield,          label: 'Verification'   },
  { to: '/dashboard/notifications', icon: Bell,            label: 'Notifications'  },
  { to: '/dashboard/profile',       icon: User,            label: 'Profile'        },
  { to: '/dashboard/settings',      icon: Settings,        label: 'Settings'       },
]

export default function DashboardSidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const links = user?.role === 'TECHNICIAN' ? technicianLinks : customerLinks

  // Avatar: initials circle
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`

  return (
    <aside className="w-60 min-h-screen bg-primary-700 flex flex-col flex-shrink-0">

      {/* Logo area */}
      <div className="px-5 pt-5 pb-4">
        <Logo size="sm" />
      </div>

      {/* User info card */}
      <div className="mx-3 mb-2 bg-primary-600 rounded-2xl px-4 py-5 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-3">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.firstName}
              className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-white/30"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-primary-700 font-bold text-xl shadow-md overflow-hidden">
              {user?.firstName ? (
                <span>{initials}</span>
              ) : (
                <User className="w-8 h-8 text-primary-400" />
              )}
            </div>
          )}
          {/* Online dot */}
          <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-400 border-2 border-primary-600 rounded-full" />
        </div>
        <p className="font-bold text-white text-sm">{user?.firstName} {user?.lastName}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-400 text-xs">⭐</span>
          <span className="text-white/80 text-xs font-medium capitalize">
            {user?.role === 'TECHNICIAN' ? 'Technician' : user?.role === 'ADMIN' ? 'Admin' : 'Customer'}
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {links.map(link => {
          const Icon = link.icon
          const active = pathname === link.to || (link.to !== '/dashboard' && pathname.startsWith(link.to))
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-white/80 hover:bg-primary-600 hover:text-white'
              }`}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{link.label}</span>
              {'badge' in link && link.badge && (
                <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {link.badge}
                </span>
              )}
            </Link>
          )
        })}
        <button
          onClick={() => { logout(); navigate('/') }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-primary-600 hover:text-white transition-all w-full">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </nav>

      {/* Help card */}
      <div className="m-3 bg-primary-600 rounded-2xl p-4 text-center">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
          <Headphones className="w-5 h-5 text-white" />
        </div>
        <p className="text-xs font-bold text-white mb-0.5">Need Help?</p>
        <p className="text-white/60 text-xs mb-3">Our support team is here to help you 24/7.</p>
        <Link to="/dashboard/support"
          className="block bg-white text-primary-700 text-xs font-bold py-1.5 px-4 rounded-full hover:bg-primary-50 transition-colors">
          Contact Support →
        </Link>
      </div>
    </aside>
  )
}
