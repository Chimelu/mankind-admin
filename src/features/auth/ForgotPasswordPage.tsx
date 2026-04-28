import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../state/AdminAuthContext'

export function ForgotPasswordPage() {
  const { isAuthenticated } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [notice, setNotice] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setNotice(`Password reset link sent to ${email}`)
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
          <button className="w-full rounded-full bg-emerald-700 py-2.5 text-sm font-semibold text-white">
            Send reset link
          </button>
        </form>
        {notice && <p className="mt-3 text-sm font-medium text-emerald-700">{notice}</p>}
        <p className="mt-4 text-sm">
          <Link to="/auth/sign-in" className="font-semibold text-emerald-700 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </section>
  )
}
