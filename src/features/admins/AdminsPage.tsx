import { useEffect, useState } from 'react'
import { ConfirmModal } from '../../components/common/ConfirmModal'
import {
  createAdmin,
  editAdmin,
  getAdmins,
  removeAdmin,
  type AdminDto,
} from '../../api/admins.api'

type AdminFormInput = {
  fullName: string
  email: string
  role: 'super_admin' | 'admin'
  isActive: boolean
  password: string
}

export function AdminsPage() {
  const [admins, setAdmins] = useState<AdminDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<AdminDto | null>(null)
  const [deletingAdmin, setDeletingAdmin] = useState<AdminDto | null>(null)

  const stats = [
    { label: 'Total Admins', value: String(admins.length) },
    {
      label: 'Active Admins',
      value: String(admins.filter((item) => item.isActive).length),
    },
    {
      label: 'Super Admins',
      value: String(admins.filter((item) => item.role === 'super_admin').length),
    },
  ]

  const loadAdmins = async () => {
    const data = await getAdmins()
    setAdmins(data)
  }

  useEffect(() => {
    ;(async () => {
      try {
        await loadAdmins()
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load admins')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Team Access
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Admins</h1>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
        >
          Create admin
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => (
          <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 overflow-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {loading && <p className="pb-3 text-sm text-slate-500">Loading admins...</p>}
        {error && <p className="pb-3 text-sm font-medium text-red-600">{error}</p>}
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="py-3 font-semibold text-slate-800">{admin.fullName}</td>
                <td className="py-3 text-slate-700">{admin.email}</td>
                <td className="py-3 text-slate-700">{admin.role}</td>
                <td className="py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      admin.isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {admin.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingAdmin(admin)}
                      className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingAdmin(admin)}
                      className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddOpen && (
        <AdminModal
          title="Create Admin"
          submitLabel="Create admin"
          initialValues={{
            fullName: '',
            email: '',
            role: 'admin',
            isActive: true,
            password: '',
          }}
          onClose={() => setIsAddOpen(false)}
          onSubmit={(payload) => {
            setError('')
            createAdmin(payload)
              .then((created) => {
                setAdmins((prev) => [created, ...prev])
                setIsAddOpen(false)
              })
              .catch((submitError) => {
                setError(
                  submitError instanceof Error ? submitError.message : 'Admin action failed',
                )
              })
          }}
        />
      )}

      {editingAdmin && (
        <AdminModal
          title="Edit Admin"
          submitLabel="Save changes"
          initialValues={{
            fullName: editingAdmin.fullName,
            email: editingAdmin.email,
            role: editingAdmin.role,
            isActive: editingAdmin.isActive,
            password: '',
          }}
          onClose={() => setEditingAdmin(null)}
          onSubmit={(payload) => {
            setError('')
            editAdmin(editingAdmin.id, {
              fullName: payload.fullName,
              email: payload.email,
              role: payload.role,
              isActive: payload.isActive,
              ...(payload.password ? { password: payload.password } : {}),
            })
              .then((updated) => {
                setAdmins((prev) =>
                  prev.map((item) => (item.id === editingAdmin.id ? updated : item)),
                )
                setEditingAdmin(null)
              })
              .catch((submitError) => {
                setError(
                  submitError instanceof Error ? submitError.message : 'Admin action failed',
                )
              })
          }}
        />
      )}

      {deletingAdmin && (
        <ConfirmModal
          title="Delete admin"
          message={`Are you sure you want to delete "${deletingAdmin.fullName}"?`}
          onCancel={() => setDeletingAdmin(null)}
          onConfirm={() => {
            setError('')
            removeAdmin(deletingAdmin.id)
              .then(() => {
                setAdmins((prev) => prev.filter((item) => item.id !== deletingAdmin.id))
                setDeletingAdmin(null)
              })
              .catch((submitError) => {
                setError(
                  submitError instanceof Error ? submitError.message : 'Admin action failed',
                )
              })
          }}
        />
      )}
    </section>
  )
}

function AdminModal({
  title,
  submitLabel,
  initialValues,
  onSubmit,
  onClose,
}: {
  title: string
  submitLabel: string
  initialValues: AdminFormInput
  onSubmit: (payload: AdminFormInput) => Promise<void> | void
  onClose: () => void
}) {
  const [form, setForm] = useState<AdminFormInput>(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
      <button className="absolute inset-0 bg-black/40" aria-label="Close modal" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="rounded-full border border-slate-300 px-3 py-1 text-sm">
            Close
          </button>
        </div>

        <form
          className="mt-4 grid gap-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            setIsSubmitting(true)
            Promise.resolve(onSubmit(form)).finally(() => setIsSubmitting(false))
          }}
        >
          <Input
            label="Full name"
            value={form.fullName}
            onChange={(value) => setForm((prev) => ({ ...prev, fullName: value }))}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
            required={title === 'Create Admin'}
          />
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Role</span>
            <select
              value={form.role}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  role: event.target.value as AdminFormInput['role'],
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Status</span>
            <select
              value={form.isActive ? 'active' : 'inactive'}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  isActive: event.target.value === 'active',
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          <button
            disabled={isSubmitting}
            className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
        </form>
      </div>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  required = true,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
      />
    </label>
  )
}
