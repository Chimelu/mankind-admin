import { useState, type FormEvent } from 'react'
import { useAdminAuth } from '../../state/AdminAuthContext'

export function ProfilePage() {
  const { adminUser, updateProfile, changePassword } = useAdminAuth()
  const [profileForm, setProfileForm] = useState({
    name: adminUser?.name ?? '',
    email: adminUser?.email ?? '',
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [profileError, setProfileError] = useState('')

  const handleProfileSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsSavingProfile(true)
    setProfileMessage('')
    setProfileError('')
    try {
      await updateProfile(profileForm)
      setProfileMessage('Profile updated successfully.')
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setPasswordError('')
    setPasswordMessage('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.')
      return
    }

    setIsChangingPassword(true)
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordMessage('Password changed successfully.')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch {
      setPasswordError('Unable to change password right now.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <section>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Account
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Profile Settings</h1>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Edit Profile</h2>
          <p className="mt-1 text-sm text-slate-500">
            Update your display name and email address.
          </p>

          <form className="mt-4 space-y-4" onSubmit={handleProfileSubmit}>
            <Input
              label="Full Name"
              value={profileForm.name}
              onChange={(value) => setProfileForm((prev) => ({ ...prev, name: value }))}
            />
            <Input
              label="Email"
              type="email"
              value={profileForm.email}
              onChange={(value) => setProfileForm((prev) => ({ ...prev, email: value }))}
            />

            <button
              disabled={isSavingProfile}
              className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSavingProfile ? 'Saving...' : 'Save profile'}
            </button>
          </form>
          {profileMessage && (
            <p className="mt-3 text-sm font-medium text-emerald-700">{profileMessage}</p>
          )}
          {profileError && (
            <p className="mt-3 text-sm font-medium text-red-600">{profileError}</p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
          <p className="mt-1 text-sm text-slate-500">
            Set a new password to keep your account secure.
          </p>

          <form className="mt-4 space-y-4" onSubmit={handlePasswordSubmit}>
            <Input
              label="Current Password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(value) =>
                setPasswordForm((prev) => ({ ...prev, currentPassword: value }))
              }
            />
            <Input
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(value) =>
                setPasswordForm((prev) => ({ ...prev, newPassword: value }))
              }
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(value) =>
                setPasswordForm((prev) => ({ ...prev, confirmPassword: value }))
              }
            />

            <button
              disabled={isChangingPassword}
              className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isChangingPassword ? 'Updating...' : 'Update password'}
            </button>
          </form>
          {passwordError && (
            <p className="mt-3 text-sm font-medium text-red-600">{passwordError}</p>
          )}
          {passwordMessage && (
            <p className="mt-3 text-sm font-medium text-emerald-700">{passwordMessage}</p>
          )}
        </section>
      </div>
    </section>
  )
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
      />
    </label>
  )
}
