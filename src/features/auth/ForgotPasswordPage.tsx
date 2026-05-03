import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { sendAdminPasswordResetOtp } from '../../api/admin-auth.api'
import { useAdminAuth } from '../../state/AdminAuthContext'

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await sendAdminPasswordResetOtp({ email })
      navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to send OTP')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto flex min-h-screen max-w-[96rem] items-center px-3 py-8 md:px-5">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-3xl font-bold text-slate-900">Forgot password</h1>
        <p className="mt-2 text-sm text-slate-500">Enter your email to reset access.</p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@mankind.com"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
          <button
            disabled={isSubmitting}
            className="w-full rounded-full bg-emerald-700 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
        {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
        <p className="mt-4 text-sm">
          <Link to="/auth/sign-in" className="font-semibold text-emerald-700 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </section>
  )
}
