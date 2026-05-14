import { useState, type ReactNode } from 'react'
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
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
          aria-label="Open menu"
        >
          Menu
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Mankind Admin
          </p>
          <p className="text-sm font-bold text-slate-900">Control Panel</p>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-0px)]">
        <aside className="hidden w-64 border-r border-slate-800/80 bg-slate-950 px-4 py-6 text-slate-100 lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:overflow-y-auto">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
              <BrandMarkIcon />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300/90">
                Mankind
              </p>
              <h1 className="text-lg font-bold leading-tight text-white">Admin</h1>
            </div>
          </div>

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
            <aside className="absolute left-0 top-0 h-full w-[82%] max-w-xs border-r border-slate-800/80 bg-slate-950 px-4 py-6 text-slate-100 shadow-2xl">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
                    <BrandMarkIcon />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300/90">
                      Mankind
                    </p>
                    <h1 className="truncate text-lg font-bold text-white">Admin</h1>
                  </div>
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

        <main className="min-w-0 flex-1 px-3 py-4 md:px-6 md:py-6 lg:ml-64">
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

const navItems: { to: string; label: string; icon: ReactNode }[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <IconDashboard /> },
  { to: '/products', label: 'Products', icon: <IconProducts /> },
  { to: '/admins', label: 'Admins', icon: <IconAdmins /> },
  { to: '/orders', label: 'Orders', icon: <IconOrders /> },
  { to: '/distributors', label: 'Distributors', icon: <IconDistributors /> },
  {
    to: '/pharmacies-hospitals',
    label: 'Pharmacies & hospitals',
    icon: <IconFacilities />,
  },
  { to: '/profile', label: 'Profile', icon: <IconProfile /> },
]

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="mt-8 space-y-1 border-t border-slate-800/80 pt-6">
      <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        Menu
      </p>
      {navItems.map((item) => (
        <SidebarLink
          key={item.to}
          to={item.to}
          label={item.label}
          icon={item.icon}
          onNavigate={onNavigate}
        />
      ))}
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
    <div className="mt-10 rounded-xl border border-slate-700/90 bg-slate-900/80 p-3.5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-emerald-400 ring-1 ring-slate-700">
          <IconProfile />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Signed in</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-white">{adminUser?.name}</p>
          <p className="truncate text-xs text-slate-400">{adminUser?.email}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:text-emerald-300"
      >
        <IconLogout />
        Logout
      </button>
    </div>
  )
}

function SidebarLink({
  to,
  label,
  icon,
  onNavigate,
}: {
  to: string
  label: string
  icon: ReactNode
  onNavigate?: () => void
}) {
  return (
    <NavLink to={to} onClick={onNavigate} className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
      {({ isActive }) => (
        <span
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
            isActive
              ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25'
              : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
          }`}
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${
              isActive
                ? 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/30'
                : 'bg-slate-800/90 text-slate-400 ring-slate-700/80'
            }`}
          >
            {icon}
          </span>
          <span className="truncate">{label}</span>
        </span>
      )}
    </NavLink>
  )
}

function BrandMarkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 3 4 9v12h16V9l-8-6Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21V12h6v9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconDashboard() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 13h7V4H4v9ZM13 20h7v-7h-7v7ZM4 20h7v-5H4v5ZM13 4v5h7V4h-7Z" strokeLinejoin="round" />
    </svg>
  )
}

function IconProducts() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" strokeLinejoin="round" />
      <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" strokeLinejoin="round" />
    </svg>
  )
}

function IconAdmins() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconOrders() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9" y="3" width="6" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12h6M9 16h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconDistributors() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18h2a1 1 0 0 0 1-1v-3.18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 22h12M18 22h3M16 6h5l3 4v6a1 1 0 0 1-1 1h-1" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17" cy="18" r="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconFacilities() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M3 21h18M5 21V7l8-4v18M19 21V11h-4v10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 9v.01M9 13v.01M9 17v.01M15 14h2M15 18h2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconProfile() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="8" r="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 21v-1a6 6 0 0 1 12 0v1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
