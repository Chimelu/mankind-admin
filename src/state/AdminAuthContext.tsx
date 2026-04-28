import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  getAdminProfile,
  loginAdmin,
  updateAdminPassword,
  updateAdminProfile,
} from '../api/admin-auth.api'

type AdminUser = {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin'
  isActive: boolean
}

type AdminAuthContextValue = {
  adminUser: AdminUser | null
  isAuthenticated: boolean
  signIn: (payload: { email: string; password: string }) => Promise<void>
  updateProfile: (payload: { name: string; email: string }) => Promise<void>
  changePassword: (payload: {
    currentPassword: string
    newPassword: string
  }) => Promise<void>
  signOut: () => void
}

const STORAGE_KEY = 'mankind-admin-user'
const TOKEN_STORAGE_KEY = 'mankind-admin-token'

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  })
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as AdminUser) : null
  })

  useEffect(() => {
    if (!token || adminUser) return
    getAdminProfile(token)
      .then((profile) => {
        persist(
          {
            id: profile.id,
            name: profile.fullName,
            email: profile.email,
            role: profile.role,
            isActive: profile.isActive,
          },
          token,
        )
      })
      .catch(() => {
        persist(null, null)
      })
  }, [token, adminUser])

  const persist = (user: AdminUser | null, nextToken: string | null = token) => {
    setAdminUser(user)
    setToken(nextToken)
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
    if (nextToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, nextToken)
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }

  const signIn = async (payload: { email: string; password: string }) => {
    const result = await loginAdmin(payload)
    persist(
      {
        id: result.admin.id,
        name: result.admin.fullName,
        email: result.admin.email,
        role: result.admin.role,
        isActive: result.admin.isActive,
      },
      result.token,
    )
  }

  const updateProfile = async (payload: { name: string; email: string }) => {
    if (!adminUser || !token) return
    const updated = await updateAdminProfile(token, {
      fullName: payload.name,
      email: payload.email,
    })
    persist({
      id: updated.id,
      name: updated.fullName,
      email: updated.email,
      role: updated.role,
      isActive: updated.isActive,
    })
  }

  const changePassword = async (payload: {
    currentPassword: string
    newPassword: string
  }) => {
    if (!token) return
    await updateAdminPassword(token, payload)
  }

  const signOut = () => persist(null, null)

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      adminUser,
      isAuthenticated: Boolean(adminUser),
      signIn,
      updateProfile,
      changePassword,
      signOut,
    }),
    [adminUser],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}
