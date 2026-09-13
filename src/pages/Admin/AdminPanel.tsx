import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Tags,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { api } from '../../services/api'
import AdminCategories from './AdminCategories'
import AdminProducts from './AdminProducts'

type AdminSection = 'dashboard' | 'categories' | 'products'

function AdminPanel() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] =
    useState<AdminSection>('dashboard')

  const handleLogout = async () => {
    const token = localStorage.getItem('alaska_admin_token')

    try {
      if (token) {
        await fetch(`${api.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } finally {
      localStorage.removeItem('alaska_admin_token')
      navigate('/admin')
    }
  }

  const handleSectionChange = (section: AdminSection) => {
    setActiveSection(section)
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#FDF8F8]">
      {mobileMenuOpen && (
        <button
          aria-label="Cerrar menú"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-[#E6B7BB]/40 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-24 items-center justify-between border-b border-[#E6B7BB]/30 px-6">
            <div>
              <h1 className="font-serif text-2xl text-[#590E1A]">
                Alaska Beauty
              </h1>

              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#B88A44]">
                Administración
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full p-2 text-[#590E1A] hover:bg-[#F7E9EA] lg:hidden"
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6">
            <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#590E1A]/40">
              Gestión
            </p>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleSectionChange('dashboard')}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeSection === 'dashboard'
                    ? 'bg-[#F7E9EA] text-[#590E1A]'
                    : 'text-[#590E1A]/70 hover:bg-[#FDF3F4] hover:text-[#590E1A]'
                }`}
              >
                <LayoutDashboard size={19} />
                Dashboard
              </button>

              <button
                type="button"
                onClick={() => handleSectionChange('products')}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeSection === 'products'
                    ? 'bg-[#F7E9EA] text-[#590E1A]'
                    : 'text-[#590E1A]/70 hover:bg-[#FDF3F4] hover:text-[#590E1A]'
                }`}
              >
                <Package size={19} />
                Productos
              </button>

              <button
                type="button"
                onClick={() => handleSectionChange('categories')}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeSection === 'categories'
                    ? 'bg-[#F7E9EA] text-[#590E1A]'
                    : 'text-[#590E1A]/70 hover:bg-[#FDF3F4] hover:text-[#590E1A]'
                }`}
              >
                <Tags size={19} />
                Categorías
              </button>
            </div>
          </nav>

          <div className="border-t border-[#E6B7BB]/30 p-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#590E1A]/70 transition hover:bg-[#FDF3F4] hover:text-[#590E1A]"
            >
              <LogOut size={19} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="flex h-20 items-center justify-between border-b border-[#E6B7BB]/30 bg-white px-6 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl p-2 text-[#590E1A] hover:bg-[#F7E9EA] lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#B88A44]">
                Panel administrativo
              </p>

              <h2 className="font-serif text-2xl text-[#590E1A]">
                {activeSection === 'dashboard' && 'Dashboard'}
                {activeSection === 'products' && 'Productos'}
                {activeSection === 'categories' && 'Categorías'}
              </h2>
            </div>
          </div>
        </header>

        <main className="p-6 sm:p-8">
          <div className="mx-auto max-w-7xl">
            {activeSection === 'dashboard' && (
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <p className="text-sm text-[#590E1A]/60">
                  Bienvenido al panel administrativo de Alaska Beauty.
                </p>

                <h3 className="mt-2 font-serif text-3xl text-[#590E1A]">
                  Administración de la tienda
                </h3>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#590E1A]/60">
                  Desde aquí podrás administrar productos, categorías e
                  imágenes del catálogo.
                </p>
              </div>
            )}

            {activeSection === 'products' && <AdminProducts />}

            {activeSection === 'categories' && <AdminCategories />}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminPanel