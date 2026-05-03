import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import {
  resetAdminPassword,
  verifyAdminPasswordResetOtp,
} from '../../api/admin-auth.api'
import { useAdminAuth } from '../../state/AdminAuthContext'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAdminAuth()
  const email = searchParams.get('email') ?? ''
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsSubmitting(true)
    try {
      await verifyAdminPasswordResetOtp({ email, otp })
      await resetAdminPassword({ email, otp, newPassword })
      navigate('/auth/sign-in')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Password reset failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto flex min-h-screen max-w-[96rem] items-center px-3 py-8 md:px-5">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-3xl font-bold text-slate-900">Reset password</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter OTP sent to {email || 'your email'} and set a new password.
        </p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <input
            required
            maxLength={6}
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="6-digit OTP"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
          <input
            type="password"
            required
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="New password"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm new password"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
          <button
            disabled={isSubmitting}
            className="w-full rounded-full bg-emerald-700 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Resetting...' : 'Reset password'}
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
