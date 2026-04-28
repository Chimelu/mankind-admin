import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../state/AdminAuthContext'

type Props = {
  children: ReactNode
}

export function RequireAdminAuth({ children }: Props) {
  const { isAuthenticated } = useAdminAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
