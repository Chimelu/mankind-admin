const stats = [
  { label: 'Total Orders', value: '1,284', change: '+12.4%' },
  { label: 'Products', value: '112', change: '+4.1%' },
  { label: 'Low Stock', value: '9', change: '-2 items' },
  { label: 'Revenue (30d)', value: '₦24.8M', change: '+8.9%' },
]

const recentOrders: Array<{ id: string; customer: string; total: string; status: string }> = []

export function DashboardPage() {
  return (
    <section>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Dashboard</h1>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
            <p className="mt-1 text-xs font-semibold text-emerald-700">{item.change}</p>
          </article>
        ))}
      </div>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
          <button className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700">
            View all
          </button>
        </div>
        {recentOrders.length === 0 ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            No recent orders yet.
          </div>
        ) : (
          <div className="mt-4 overflow-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-2 font-medium">Order ID</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Total</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 font-semibold text-slate-800">{order.id}</td>
                    <td className="py-3 text-slate-700">{order.customer}</td>
                    <td className="py-3 font-semibold text-slate-800">{order.total}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  )
}
