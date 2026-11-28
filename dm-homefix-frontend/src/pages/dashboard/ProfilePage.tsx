import { useState, useRef } from 'react'
import DashboardSidebar from '../../components/DashboardSidebar'
import { useAuthStore } from '../../store/authStore'
import { accountApi } from '../../lib/api'
import { Save, Loader2, User, Mail, MapPin, Globe, Camera } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    preferredLanguage: user?.preferredLanguage || 'en',
    serviceLocation: user?.serviceLocation || '',
  })
  const [saving,     setSaving]     = useState(false)
  const [uploading,  setUploading]  = useState(false)
  const [avatarUrl,  setAvatarUrl]  = useState<string | null>(
    (user as { avatarUrl?: string })?.avatarUrl || null
  )

  // ── Avatar upload ──────────────────────────────────────────────────────────
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPEG, PNG, or WebP images are allowed.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB.')
      return
    }

    // Show preview immediately
    const preview = URL.createObjectURL(file)
    setAvatarUrl(preview)

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const { data } = await accountApi.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setAvatarUrl(data.avatarUrl)
      updateUser({ ...user, avatarUrl: data.avatarUrl } as never)
      toast.success('Profile photo updated!')
    } catch {
      toast.error('Failed to upload photo. Please try again.')
      setAvatarUrl((user as { avatarUrl?: string })?.avatarUrl || null)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // ── Profile save ──────────────────────────────────────────────────────────
  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await accountApi.patch('/profile', form)
      updateUser(data)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto p-6 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your account information</p>
        </div>

        {/* Avatar card */}
        <div className="card mb-5 flex items-center gap-5">
          {/* Clickable avatar */}
          <div className="relative flex-shrink-0 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-24 h-24 rounded-2xl object-cover shadow-md"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-md">
                {initials || <User className="w-10 h-10" />}
              </div>
            )}

            {/* Upload overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {uploading
                ? <Loader2 className="w-7 h-7 text-white animate-spin" />
                : <Camera className="w-7 h-7 text-white" />
              }
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
            <p className="text-gray-500 text-sm mt-0.5">{user?.email}</p>
            <span className="mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
              {user?.role}
            </span>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <Camera className="w-3 h-3" />
              Click photo to upload a new one (JPEG/PNG/WebP, max 5 MB)
            </p>
          </div>
        </div>

        {/* Profile form */}
        <form onSubmit={handleSave} className="card space-y-4">
          <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3">Personal Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-gray-400" /> First Name
              </label>
              <input className="input" value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
              <input className="input" value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-gray-400" /> Email
            </label>
            <input className="input bg-gray-50 cursor-not-allowed" value={user?.email || ''} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" /> Service Location
            </label>
            <input className="input" placeholder="e.g. Kebele 05, Debre Markos"
              value={form.serviceLocation}
              onChange={e => setForm(f => ({ ...f, serviceLocation: e.target.value }))} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-gray-400" /> Preferred Language
            </label>
            <select className="input" value={form.preferredLanguage}
              onChange={e => setForm(f => ({ ...f, preferredLanguage: e.target.value as 'en' | 'am' }))}>
              <option value="en">English</option>
              <option value="am">አማርኛ (Amharic)</option>
            </select>
          </div>

          <button type="submit" disabled={saving}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </main>
    </div>
  )
}
