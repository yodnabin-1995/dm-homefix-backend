import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { bookingApi } from '../../lib/api'
import { useAuthStore } from '../../store/authStore'
import DashboardSidebar from '../../components/DashboardSidebar'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import { CalendarCheck, CheckCircle, Star, Wallet, CalendarDays, Zap, Bell, ChevronDown } from 'lucide-react'
import { formatDateTime } from '../../lib/utils'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

const bookingChartData = [
  { month: 'Jun', bookings: 1 }, { month: 'Jul', bookings: 2 },
  { month: 'Aug', bookings: 2 }, { month: 'Sep', bookings: 3 },
  { month: 'Oct', bookings: 4 }, { month: 'Nov', bookings: 5 },
]

const pieData = [
  { name: 'Plumbing',   value: 30, color: '#3b82f6' },
  { name: 'Electrical', value: 25, color: '#f97316' },
  { name: 'Painting',   value: 20, color: '#8b5cf6' },
  { name: 'Cleaning',   value: 15, color: '#10b981' },
  { name: 'Others',     value: 10, color: '#9ca3af'  },
]

// Mock technician names for display
const mockTechNames: Record<number, string> = {
  0: 'Getachew Asrat',
  1: 'Alemu Bekele',
  2: 'Mekdes Tadesse',
}

export default function DashboardPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [topUserOpen, setTopUserOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setTopUserOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const { data: bookings = [] } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingApi.get('/bookings').then(r => r.data),
  })

  const completed = bookings.filter((b: { status: string }) => b.status === 'COMPLETED').length
  const pending   = bookings.filter((b: { status: string }) => b.status === 'PENDING').length

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        {/* Top navbar strip */}
        <div className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
            {[['/', 'Home'], ['/services', 'Services'], ['/technicians', 'Find a Technician'], ['/about', 'About'], ['/reviews', 'Reviews'], ['/contact', 'Contact']].map(([to, label]) => (
              <Link key={to} to={to} className="hover:text-primary-600 transition-colors whitespace-nowrap">{label}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {/* Bell */}
            <Link to="/dashboard/notifications" className="relative p-1.5 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">2</span>
            </Link>
            {/* User dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setTopUserOpen(o => !o)}
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
              {topUserOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <Link to="/dashboard" onClick={() => setTopUserOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">Dashboard</Link>
                  <Link to="/dashboard/profile" onClick={() => setTopUserOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">Profile</Link>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={() => { logout(); navigate('/') }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Welcome hero banner */}
          <div className="relative rounded-2xl overflow-hidden h-40 shadow-md">
            <img src="/images/background.png" alt="" className="absolute inset-0 w-full h-full object-cover object-right" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/85 via-primary-800/65 to-transparent" />
            <div className="absolute inset-0 flex items-center px-8 gap-5">
              {/* Handshake icon circle */}
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/30">
                <span className="text-3xl">🤝</span>
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold mb-0.5">Welcome back, {user?.firstName}!</h1>
                <p className="text-white/75 text-sm mb-3">Find trusted home repair services in Debre Markos.</p>
                <Link to="/book"
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2 rounded-full border border-white/20 transition-colors">
                  Book a Service →
                </Link>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Bookings"      value={bookings.length || 5} icon={CalendarCheck}
              iconColor="text-primary-600" iconBg="bg-primary-50"
              trend={{ value: '+20%', positive: true }} />
            <StatCard title="Completed Services"  value={completed || 4}       icon={CheckCircle}
              iconColor="text-green-600"   iconBg="bg-green-50"
              trend={{ value: '+33%', positive: true }} />
            <StatCard title="Your Rating"         value="4.8"                  icon={Star}
              iconColor="text-yellow-500"  iconBg="bg-yellow-50"
              subtitle="(120 reviews)" />
            <StatCard title="Total Spent"         value="ETB 2,500"            icon={Wallet}
              iconColor="text-purple-600"  iconBg="bg-purple-50" />
          </div>

          {/* Charts + Need Help row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Area chart */}
            <div className="lg:col-span-1 card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary-600" /> Your Booking Overview
                </h2>
                <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none text-gray-500 bg-white">
                  <option>Last 6 Months</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={bookingChartData}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#1d4ed8" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} width={20} />
                  <Tooltip />
                  <Area type="monotone" dataKey="bookings" stroke="#1d4ed8" strokeWidth={2}
                    fill="url(#grad)" dot={{ fill: '#1d4ed8', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            <div className="card">
              <h2 className="font-bold text-gray-900 text-sm mb-3">Services Distribution</h2>
              <div className="flex justify-center mb-2">
                <div className="relative">
                  <ResponsiveContainer width={140} height={140}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-800">100%</p>
                      <p className="text-xs text-gray-400">Services</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      <span className="text-gray-600">{d.name}</span>
                    </div>
                    <span className="font-semibold text-gray-700">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Need a Home Repair card */}
            <div className="relative rounded-2xl overflow-hidden shadow-md">
              <img src="/images/background.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-primary-700/82" />
              <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white text-base">Need a Home Repair?</h3>
                      <p className="text-white/70 text-xs mt-1">
                        Book now and get fast, reliable and affordable service in Debre Markos.
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                      <span className="text-2xl">🏠</span>
                    </div>
                  </div>
                </div>
                <Link to="/book"
                  className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors self-start mt-2">
                  Book a Service ✦
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Bookings + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Recent Bookings table */}
            <div className="lg:col-span-2 card overflow-hidden p-0">
              <div className="flex items-center justify-between px-5 py-4">
                <h2 className="font-bold text-gray-900">Recent Bookings</h2>
                <Link to="/dashboard/bookings" className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1">
                  View All →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-y border-gray-100">
                    <tr>
                      {['#', 'Service', 'Technician', 'Date & Time', 'Status', 'Action'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bookings.length > 0 ? (
                      bookings.slice(0, 3).map((b: { id: string; serviceCategoryId: string; preferredSchedule: string; status: string }, i: number) => (
                        <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-500 text-xs">{i + 1}</td>
                          <td className="px-4 py-3 font-semibold text-gray-800">{b.serviceCategoryId}</td>
                          <td className="px-4 py-3 text-gray-600">{mockTechNames[i] ?? 'Assigned Technician'}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{formatDateTime(b.preferredSchedule)}</td>
                          <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                          <td className="px-4 py-3">
                            <Link to="/dashboard/bookings"
                              className="text-xs border border-gray-300 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-50 font-medium">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      /* Demo rows when no real bookings */
                      [
                        { id: 1, service: 'Plumbing',   tech: 'Getachew Asrat',  date: 'Nov 30, 2025 - 09:00 AM', status: 'PENDING'   },
                        { id: 2, service: 'Electrical',  tech: 'Alemu Bekele',    date: 'Nov 28, 2025 - 02:00 PM', status: 'CONFIRMED' },
                        { id: 3, service: 'Painting',    tech: 'Mekdes Tadesse',  date: 'Nov 25, 2025 - 10:00 AM', status: 'COMPLETED' },
                      ].map(row => (
                        <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-500 text-xs">{row.id}</td>
                          <td className="px-4 py-3 font-semibold text-gray-800">{row.service}</td>
                          <td className="px-4 py-3 text-gray-600">{row.tech}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{row.date}</td>
                          <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                          <td className="px-4 py-3">
                            <button className="text-xs border border-gray-300 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-50 font-medium">View</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Book a Service',  to: '/book',              emoji: '📅', bg: 'bg-primary-50',  color: 'text-primary-600' },
                  { label: 'Find a Technician', to: '/technicians',     emoji: '🔧', bg: 'bg-orange-50',   color: 'text-orange-600'  },
                  { label: 'View Reviews',    to: '/reviews',           emoji: '⭐', bg: 'bg-yellow-50',   color: 'text-yellow-600'  },
                  { label: 'Get Support',     to: '/dashboard/support', emoji: '🎧', bg: 'bg-green-50',    color: 'text-green-600'   },
                ].map(({ label, to, emoji, bg }) => (
                  <Link key={label} to={to}
                    className={`flex flex-col items-center gap-2 p-4 ${bg} rounded-2xl hover:scale-105 transition-transform cursor-pointer text-center`}>
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-xs font-semibold text-gray-700 leading-tight">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
