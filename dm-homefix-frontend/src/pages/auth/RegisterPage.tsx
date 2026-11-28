import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import Logo from '../../components/Logo'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', password:'', role:'CUSTOMER' as 'CUSTOMER'|'TECHNICIAN' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Client-side validation before sending
    if (!form.email.trim()) { toast.error('Email address is required'); return }
    if (!form.firstName.trim()) { toast.error('First name is required'); return }
    if (!form.lastName.trim()) { toast.error('Last name is required'); return }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }

    setLoading(true)
    try {
      const payload = {
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        password: form.password,
        role: form.role,
        preferredLanguage: 'en',
      }
      const res = await register(payload)
      toast.success('Account created! Check your email for the OTP code.')
      // replace: true removes the register page from history
      // so after verification → login, pressing Back goes to homepage not register
      navigate(`/auth/verify-otp?accountId=${res.accountId}&email=${encodeURIComponent(payload.email)}`, { replace: true })
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data
      const msg = Array.isArray(data?.message) ? data.message[0] : data?.message
      if (msg === 'EMAIL_TAKEN') {
        toast.error('This email is already registered.', { duration: 5000 })
        setTimeout(() => navigate('/auth/login'), 1500)
      } else if (msg === 'PHONE_TAKEN') {
        toast.error('This phone number is already registered.')
      } else if (msg) {
        toast.error(msg)
      } else {
        toast.error('Registration failed. Please check your details and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 bg-white">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-6"><Logo size="lg" /></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Join DM HomeFix</h1>
          <p className="text-gray-500 text-sm mb-6">Get started in just a few steps</p>
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {(['CUSTOMER','TECHNICIAN'] as const).map(role => (
              <button key={role} type="button" onClick={() => setForm(f => ({ ...f, role }))}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${form.role===role?'border-primary-600 bg-primary-50 text-primary-700':'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {role === 'CUSTOMER' ? '👤 Customer' : '🔧 Technician'}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                <input className="input" placeholder="Abebe" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName:e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                <input className="input" placeholder="Kebede" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName:e.target.value }))} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email:e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass?'text':'password'} className="input pr-10" placeholder="Create a password (min. 8 chars)"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password:e.target.value }))} required minLength={8} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold w-full flex items-center justify-center gap-2 py-3 rounded-xl text-base transition-colors disabled:opacity-60">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating...' : 'Create Account →'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-primary-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src="/images/background.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary-900/65" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-12">
          <Logo size="lg" className="mb-6 justify-center" />
          <h2 className="text-3xl font-bold mb-3">Fix It Right. Live Better.</h2>
          <p className="text-white/75 text-base max-w-sm">Join thousands of satisfied customers in Debre Markos getting fast, reliable home repair services.</p>
        </div>
      </div>
    </div>
  )
}
