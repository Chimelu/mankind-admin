import { useEffect, useMemo, useState } from 'react'
import { getDashboardStats, type DashboardStats } from '../../api/dashboard.api'
import { DataTable } from '../../components/common/DataTable'

const STAT_CARD_COUNT = 6

const recentOrders: Array<{ id: string; customer: string; total: string; status: string }> = []

function StatCardSkeleton() {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="h-4 w-32 max-w-[75%] animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-9 w-24 animate-pulse rounded bg-slate-200" />
    </article>
  )
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')
    getDashboardStats()
      .then((data) => {
        if (mounted) setStats(data)
      })
      .catch((err: unknown) => {
        if (mounted) {
          setStats(null)
          setError(err instanceof Error ? err.message : 'Failed to load stats')
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const statCards = useMemo(() => {
    if (!stats) return null
    return [
      { label: 'Total products', value: String(stats.totalProducts) },
      { label: 'Active products', value: String(stats.activeProducts) },
      { label: 'Draft products', value: String(stats.draftProducts) },
      {
        label: `Low stock (≤${stats.lowStockThreshold})`,
        value: String(stats.lowStockProducts),
      },
      { label: 'Categories', value: String(stats.totalCategories) },
      { label: 'Distributors', value: String(stats.totalDistributors) },
    ]
  }, [stats])

  const fallbackStatLabels = [
    'Total products',
    'Active products',
    'Draft products',
    'Low stock',
    'Categories',
    'Distributors',
  ]

  return (
    <section>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Dashboard</h1>
      </div>

      {error && !loading && (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
        {loading
          ? Array.from({ length: STAT_CARD_COUNT }, (_, index) => (
              <StatCardSkeleton key={`stat-skeleton-${index}`} />
            ))
          : statCards
            ? statCards.map((item) => (
                <article
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
                </article>
              ))
            : fallbackStatLabels.map((label) => (
                <article
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-400">—</p>
                </article>
              ))}
      </div>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
          <button
            type="button"
            className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700"
          >
            View all
          </button>
        </div>
        <div className="mt-4">
          <DataTable
            minWidthClass="min-w-[640px]"
            columns={['Order ID', 'Customer', 'Total', 'Status']}
            isLoading={loading}
            skeletonRowCount={5}
            emptyMessage="No recent orders yet."
            dataLength={recentOrders.length}
          >
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-semibold text-slate-800">{order.id}</td>
                <td className="px-4 py-3 text-slate-700">{order.customer}</td>
                <td className="px-4 py-3 font-semibold text-slate-800">{order.total}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </DataTable>
        </div>
      </section>
    </section>
  )
}
