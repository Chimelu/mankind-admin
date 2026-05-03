import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './components/layout/AdminLayout'
import { RequireAdminAuth } from './components/layout/RequireAdminAuth'
import { AdminsPage } from './features/admins/AdminsPage'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { DistributorsPage } from './features/distributors/DistributorsPage'
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage'
import { ResetPasswordPage } from './features/auth/ResetPasswordPage'
import { OrdersPage } from './features/orders/OrdersPage'
import { ProfilePage } from './features/profile/ProfilePage'
import { SignInPage } from './features/auth/SignInPage'
import { ProductsPage } from './features/products/ProductsPage'

function App() {
  return (
    <Routes>
      <Route path="/auth/sign-in" element={<SignInPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      <Route
        path="/"
        element={
          <RequireAdminAuth>
            <AdminLayout />
          </RequireAdminAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="admins" element={<AdminsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="distributors" element={<DistributorsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
