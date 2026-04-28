import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { AdminAuthProvider } from './state/AdminAuthContext'
import { CategoriesProvider } from './state/CategoriesContext'
import { DistributorsProvider } from './state/DistributorsContext'
import { ProductsProvider } from './state/ProductsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <CategoriesProvider>
          <ProductsProvider>
            <DistributorsProvider>
              <App />
            </DistributorsProvider>
          </ProductsProvider>
        </CategoriesProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
