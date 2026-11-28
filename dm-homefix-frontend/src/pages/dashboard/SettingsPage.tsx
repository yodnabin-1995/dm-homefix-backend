import { useState } from 'react'
import DashboardSidebar from '../../components/DashboardSidebar'
import { Bell, Globe, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [lang, setLang] = useState('en')
  const [notifs, setNotifs] = useState({ email: true, sms: false, inApp: true })
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto p-6 max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your account preferences</p>
        </div>
        <div className="card">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-primary-600" />Language</h2>
          <div className="grid grid-cols-2 gap-3">
            {[{ v: 'en', l: 'English', f: '🇬🇧' }, { v: 'am', l: 'አማርኛ', f: '🇪🇹' }].map(o => (
              <button key={o.v} onClick={() => setLang(o.v)} className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${lang === o.v ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <span className="text-2xl">{o.f}</span>
                <span className={`font-semibold text-sm ${lang === o.v ? 'text-primary-700' : 'text-gray-600'}`}>{o.l}</span>
              </button>
            ))}
          </div>
          <button onClick={() => toast.success('Language saved!')} className="mt-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors">Save Language</button>
        </div>
        <div className="card">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-primary-600" />Notifications</h2>
          <div className="space-y-3">
            {[{ k: 'email', l: 'Email Notifications', s: 'Updates via email' }, { k: 'sms', l: 'SMS Notifications', s: 'SMS alerts' }, { k: 'inApp', l: 'In-App Notifications', s: 'Show in app' }].map(({ k, l, s }) => (
              <div key={k} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div><p className="text-sm font-semibold text-gray-800">{l}</p><p className="text-xs text-gray-500">{s}</p></div>
                <button onClick={() => setNotifs(n => ({ ...n, [k]: !n[k as keyof typeof n] }))} className={`relative w-11 h-6 rounded-full transition-colors ${notifs[k as keyof typeof notifs] ? 'bg-primary-600' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifs[k as keyof typeof notifs] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-primary-600" />Security</h2>
          <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
            <div><p className="text-sm font-semibold text-gray-800">Change Password</p><p className="text-xs text-gray-500">Update your account password</p></div>
            <button className="text-xs text-primary-600 font-semibold border border-primary-200 px-3 py-1.5 rounded-full hover:bg-primary-50 transition-colors">Change</button>
          </div>
        </div>
      </main>
    </div>
  )
}
