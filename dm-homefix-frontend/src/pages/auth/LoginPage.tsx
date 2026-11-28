import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import Logo from '../../components/Logo'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      const user = await login(form.identifier, form.password)
      toast.success(`Welcome back, ${user.firstName}!`)
      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg === 'INVALID_CREDENTIALS' ? 'Invalid email or password' : 'Login failed. Try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 bg-white">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8"><Logo size="lg" /></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back!</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to your account to continue</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input type="text" className="input" placeholder="you@example.com" value={form.identifier}
                onChange={e => setForm(f => ({ ...f, identifier: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="input pr-10" placeholder="Enter your password"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <a href="#" className="text-xs text-primary-600 hover:underline">Forgot Password?</a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="rounded border-gray-300 text-primary-600" />
              <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
            </div>
            <button type="submit" disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold w-full flex items-center justify-center gap-2 py-3 rounded-xl text-base transition-colors disabled:opacity-60">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-primary-600 font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
      {/* Right hero */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src="/images/background.png" alt="DM HomeFix" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary-900/65" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-12">
          <Logo size="lg" className="mb-6 justify-center" />
          <h2 className="text-3xl font-bold mb-3">Fix It Right. Live Better.</h2>
          <p className="text-white/75 text-base max-w-sm">Join thousands of satisfied customers in Debre Markos getting fast, reliable home repair services.</p>
          <div className="mt-8 grid grid-cols-3 gap-6 w-full max-w-sm">
            {[['10K+','Customers'],['98%','Satisfaction'],['500+','Technicians']].map(([v,l]) => (
              <div key={l} className="text-center">
                <p className="text-2xl font-bold text-orange-400">{v}</p>
                <p className="text-xs text-white/70 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
