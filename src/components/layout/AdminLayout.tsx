import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ConfirmModal } from '../common/ConfirmModal'
import { useAdminAuth } from '../../state/AdminAuthContext'

export function AdminLayout() {
  const navigate = useNavigate()
  const { adminUser, signOut } = useAdminAuth()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Mankind Admin
          </p>
          <p className="text-sm font-bold text-slate-900">Control Panel</p>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
        >
          Menu
        </button>
      </header>

      <div className="flex min-h-[calc(100vh-0px)]">
        <aside className="hidden w-64 bg-slate-950 px-4 py-5 text-slate-100 lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Mankind Admin
          </p>
          <h1 className="mt-2 text-xl font-bold">Control Panel</h1>

          <SidebarNav />
          <SidebarProfile
            adminUser={adminUser}
            onLogout={() => setIsLogoutConfirmOpen(true)}
          />
        </aside>

        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              className="absolute inset-0 bg-black/45"
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-label="Close menu"
            />
            <aside className="absolute left-0 top-0 h-full w-[82%] max-w-xs bg-slate-950 px-4 py-5 text-slate-100 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    Mankind Admin
                  </p>
                  <h1 className="mt-2 text-xl font-bold">Control Panel</h1>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="rounded-lg border border-slate-700 px-2 py-1 text-xs font-semibold text-slate-300"
                >
                  Close
                </button>
              </div>

              <SidebarNav onNavigate={() => setIsMobileSidebarOpen(false)} />
              <SidebarProfile
                adminUser={adminUser}
                onLogout={() => setIsLogoutConfirmOpen(true)}
              />
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1 px-3 py-4 md:px-6 md:py-6">
          <Outlet />
        </main>
      </div>

      {isLogoutConfirmOpen && (
        <ConfirmModal
          title="Confirm logout"
          message="Are you sure you want to logout?"
          confirmLabel="Logout"
          onCancel={() => setIsLogoutConfirmOpen(false)}
          onConfirm={() => {
            signOut()
            setIsMobileSidebarOpen(false)
            setIsLogoutConfirmOpen(false)
            navigate('/auth/sign-in')
          }}
        />
      )}
    </div>
  )
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="mt-8 space-y-3">
      <SidebarLink to="/dashboard" label="Dashboard" onNavigate={onNavigate} />
      <SidebarLink to="/products" label="Products" onNavigate={onNavigate} />
      <SidebarLink to="/admins" label="Admins" onNavigate={onNavigate} />
      <SidebarLink to="/orders" label="Orders" onNavigate={onNavigate} />
      <SidebarLink to="/distributors" label="Distributors" onNavigate={onNavigate} />
      <SidebarLink to="/profile" label="Profile" onNavigate={onNavigate} />
    </nav>
  )
}

function SidebarProfile({
  adminUser,
  onLogout,
}: {
  adminUser: { name: string; email: string } | null
  onLogout: () => void
}) {
  return (
    <div className="mt-10 rounded-xl border border-slate-700 bg-slate-900/70 p-3">
      <p className="text-xs text-slate-400">Signed in as</p>
      <p className="mt-1 text-sm font-semibold">{adminUser?.name}</p>
      <p className="truncate text-xs text-slate-400">{adminUser?.email}</p>
      <button
        onClick={onLogout}
        className="mt-3 w-full rounded-lg border border-slate-700 py-2 text-sm font-semibold text-slate-200 hover:border-emerald-500 hover:text-emerald-300"
      >
        Logout
      </button>
    </div>
  )
}

function SidebarLink({
  to,
  label,
  onNavigate,
}: {
  to: string
  label: string
  onNavigate?: () => void
}) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `block rounded-lg px-3 py-2.5 text-sm font-bold transition ${
          isActive
            ? 'bg-emerald-500/20 text-emerald-300'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`
      }
    >
      {label}
    </NavLink>
  )
}
