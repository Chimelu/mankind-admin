import { useEffect, useState } from 'react'
import { getCustomerUsers, type CustomerUserDto } from '../../api/users.api'
import { DataTable } from '../../components/common/DataTable'

export function PharmaciesHospitalsPage() {
  const [users, setUsers] = useState<CustomerUserDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')
    getCustomerUsers()
      .then((data) => {
        if (mounted) setUsers(data)
      })
      .catch((err: unknown) => {
        if (mounted) {
          setUsers([])
          setError(err instanceof Error ? err.message : 'Failed to load accounts')
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const verified = users.filter((u) => u.isEmailVerified).length

  const stats = [
    { label: 'Registered accounts', value: String(users.length) },
    { label: 'Email verified', value: String(verified) },
    { label: 'With company name', value: String(users.filter((u) => u.companyName?.trim()).length) },
  ]

  return (
    <section>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Customer directory
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Pharmacies & hospitals</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Customer accounts registered on the storefront (pharmacies, hospitals, and other
          organizations). Data is read-only here.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
        {stats.map((item) => (
          <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
          </article>
        ))}
      </div>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-slate-900">All customer accounts</h2>
        </div>

        <div className="mt-4">
          <DataTable
            minWidthClass="min-w-[960px]"
            columns={[
              'Contact name',
              'Organization',
              'CAC',
              'Email',
              'Verified',
              'Address',
              'Joined',
            ]}
            isLoading={loading}
            error={error || undefined}
            emptyMessage="No customer accounts registered yet."
            dataLength={users.length}
          >
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 font-semibold text-slate-800">{user.fullName}</td>
                <td className="px-4 py-3 text-slate-700">{user.companyName || '—'}</td>
                <td className="px-4 py-3 text-slate-700">{user.cac || '—'}</td>
                <td className="px-4 py-3 text-slate-700">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      user.isEmailVerified
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {user.isEmailVerified ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="max-w-[220px] truncate px-4 py-3 text-slate-600" title={user.address}>
                  {user.address || '—'}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </DataTable>
        </div>
      </section>
    </section>
  )
}
