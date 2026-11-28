import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, Mail, RefreshCw } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import Logo from '../../components/Logo'

export default function VerifyOtpPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { verifyOtp } = useAuth()

  const accountId = searchParams.get('accountId') || ''
  const email     = searchParams.get('email')     || ''

  const [otp,       setOtp]       = useState('')
  const [loading,   setLoading]   = useState(false)
  const [resending, setResending] = useState(false)

  // Guard: if no accountId in URL, redirect to register
  if (!accountId) {
    navigate('/auth/register', { replace: true })
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await verifyOtp(accountId, otp)
      toast.success('Contact verified! Please login.')
      // replace: true means the verify page is removed from history
      // so pressing Back from login won't return here
      navigate('/auth/login', { replace: true })
    } catch {
      toast.error('Invalid or expired code. Please check your email and try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setResending(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('A new code has been sent to your email.')
    setResending(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 bg-white">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-6"><Logo size="lg" /></div>

          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-5">
            <Mail className="w-8 h-8 text-primary-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Verify Your Contact</h1>
          <p className="text-gray-500 text-sm mb-1">
            We sent a 6-digit verification code to:
          </p>
          <p className="font-semibold text-gray-900 text-base mb-6">{email}</p>

          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6 text-sm text-blue-700">
            📧 Check your inbox — the email arrives within 1 minute.<br />
            <span className="text-xs text-blue-500 mt-1 block">If you don&apos;t see it, check your Spam / Junk folder.</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Verification Code</label>
              <input
                type="text"
                inputMode="numeric"
                className="input text-3xl text-center tracking-[0.5em] font-bold"
                placeholder="000000"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Verifying...' : 'Verify Contact →'}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="text-gray-500">Didn&apos;t receive the email?</span>
            <button
              onClick={handleResend}
              disabled={resending}
              className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-semibold transition-colors disabled:opacity-50">
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              {resending ? 'Sending...' : 'Resend code'}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            Entered the wrong email?{' '}
            <button onClick={() => navigate('/auth/register', { replace: true })} className="text-primary-600 hover:underline font-medium">
              Go back
            </button>
          </p>
        </div>
      </div>

      {/* Right — hero */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src="/images/background.png" alt="DM HomeFix" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary-900/65" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-12">
          <Logo size="lg" className="mb-6 justify-center" />
          <h2 className="text-3xl font-bold mb-3">Fix It Right. Live Better.</h2>
          <p className="text-white/75 text-base max-w-sm">
            Join thousands of satisfied customers in Debre Markos getting fast, reliable home repair services.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6 w-full max-w-sm">
            {[['10K+', 'Customers'], ['98%', 'Satisfaction'], ['500+', 'Technicians']].map(([v, l]) => (
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
