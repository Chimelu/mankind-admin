import { useEffect, useState } from 'react'
import {
  getCitiesByState,
  getCountries,
  getStatesByCountry,
} from '../../api/locations.api'
import { ConfirmModal } from '../../components/common/ConfirmModal'
import { type AdminDistributor, useDistributors } from '../../state/DistributorsContext'

type DistributorInput = Omit<AdminDistributor, 'id'>

export function DistributorsPage() {
  const { distributors, loading, addDistributor, updateDistributor, deleteDistributor } =
    useDistributors()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingDistributor, setEditingDistributor] = useState<AdminDistributor | null>(null)
  const [deletingDistributor, setDeletingDistributor] = useState<AdminDistributor | null>(null)
  const [error, setError] = useState('')
  const activeCities = new Set(distributors.map((item) => item.city)).size
  const activeStates = new Set(distributors.map((item) => item.state)).size

  const stats = [
    { label: 'Total Distributors', value: String(distributors.length) },
    { label: 'Active Cities', value: String(activeCities) },
    { label: 'Active States', value: String(activeStates) },
    {
      label: 'With Email Contact',
      value: String(distributors.filter((item) => item.email.trim().length > 0).length),
    },
  ]

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Partner Network
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Distributors</h1>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
        >
          Add new distributor
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 overflow-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {loading && <p className="pb-3 text-sm text-slate-500">Loading distributors...</p>}
        {error && <p className="pb-3 text-sm font-medium text-red-600">{error}</p>}
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Country</th>
              <th className="pb-3 font-medium">City / State</th>
              <th className="pb-3 font-medium">Phone</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Address</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {distributors.map((distributor) => (
              <tr key={distributor.id}>
                <td className="py-3 font-semibold text-slate-800">{distributor.name}</td>
                <td className="py-3 text-slate-700">{distributor.country}</td>
                <td className="py-3 text-slate-700">
                  {distributor.city}, {distributor.state}
                </td>
                <td className="py-3 text-slate-700">{distributor.phone}</td>
                <td className="py-3 text-slate-700">{distributor.email}</td>
                <td className="py-3 text-slate-700">{distributor.address}</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingDistributor(distributor)}
                      className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingDistributor(distributor)}
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
        <DistributorModal
          title="Add New Distributor"
          submitLabel="Create distributor"
          onClose={() => setIsAddOpen(false)}
          initialValues={{
            name: '',
            country: 'Nigeria',
            city: '',
            state: '',
            phone: '',
            email: '',
            address: '',
          }}
          onSubmit={(payload) => {
            setError('')
            addDistributor(payload)
              .then(() => setIsAddOpen(false))
              .catch((submitError) => {
                setError(
                  submitError instanceof Error
                    ? submitError.message
                    : 'Distributor action failed',
                )
              })
          }}
        />
      )}

      {editingDistributor && (
        <DistributorModal
          title="Edit Distributor"
          submitLabel="Save changes"
          onClose={() => setEditingDistributor(null)}
          initialValues={{
            name: editingDistributor.name,
            country: editingDistributor.country,
            city: editingDistributor.city,
            state: editingDistributor.state,
            phone: editingDistributor.phone,
            email: editingDistributor.email,
            address: editingDistributor.address,
          }}
          onSubmit={(payload) => {
            setError('')
            updateDistributor(editingDistributor.id, payload)
              .then(() => setEditingDistributor(null))
              .catch((submitError) => {
                setError(
                  submitError instanceof Error
                    ? submitError.message
                    : 'Distributor action failed',
                )
              })
          }}
        />
      )}

      {deletingDistributor && (
        <ConfirmModal
          title="Delete distributor"
          message={`Are you sure you want to delete "${deletingDistributor.name}"?`}
          onCancel={() => setDeletingDistributor(null)}
          onConfirm={() => {
            setError('')
            deleteDistributor(deletingDistributor.id).catch((submitError) => {
              setError(
                submitError instanceof Error
                  ? submitError.message
                  : 'Distributor action failed',
              )
            })
            setDeletingDistributor(null)
          }}
        />
      )}
    </section>
  )
}

function DistributorModal({
  title,
  submitLabel,
  onClose,
  initialValues,
  onSubmit,
}: {
  title: string
  submitLabel: string
  onClose: () => void
  initialValues: DistributorInput
  onSubmit: (payload: DistributorInput) => Promise<void> | void
}) {
  const [form, setForm] = useState<DistributorInput>(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countries, setCountries] = useState<string[]>([])
  const [states, setStates] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  useEffect(() => {
    getCountries()
      .then((data) => {
        setCountries(data)
      })
      .catch(() => {
        setCountries([])
      })
  }, [])

  useEffect(() => {
    if (!form.country) return
    getStatesByCountry(form.country)
      .then((data) => {
        setStates(data)
      })
      .catch(() => {
        setStates([])
      })
  }, [form.country])

  useEffect(() => {
    if (!form.country || !form.state) return
    getCitiesByState(form.country, form.state)
      .then((data) => {
        setCities(data)
      })
      .catch(() => {
        setCities([])
      })
  }, [form.country, form.state])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
      <button className="absolute inset-0 bg-black/40" aria-label="Close modal" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="rounded-full border border-slate-300 px-3 py-1 text-sm">
            Close
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            setIsSubmitting(true)
            Promise.resolve(onSubmit(form)).finally(() => setIsSubmitting(false))
          }}
          className="mt-4 grid gap-4 md:grid-cols-2"
        >
          <Input label="Distributor name" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} />
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Country</span>
            <select
              value={form.country}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  country: event.target.value,
                  state: '',
                  city: '',
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              <option value="" disabled>
                Select country
              </option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">State</span>
            <select
              value={form.state}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  state: event.target.value,
                  city: '',
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              <option value="" disabled>
                Select state
              </option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">City</span>
            <select
              value={form.city}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  city: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              <option value="" disabled>
                Select city
              </option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
          <Input label="Phone" value={form.phone} onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))} />
          <Input type="email" label="Email" value={form.email} onChange={(value) => setForm((prev) => ({ ...prev, email: value }))} />
          <Input label="Address" value={form.address} onChange={(value) => setForm((prev) => ({ ...prev, address: value }))} />
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
}: {
  label: string
  value: string
  type?: string
  onChange: (value: string) => void
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
