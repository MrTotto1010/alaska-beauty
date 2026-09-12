import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, ShoppingBag, X } from 'lucide-react'
import logo from '../../assets/brand/Logo.svg'
import { useCart } from '../../contexts/CartContext'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalItems } = useCart()

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <header className="relative border-b border-[#590E1A]/10 bg-[#E6B7BB]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" onClick={closeMenu}>
          <img
            src={logo}
            alt="Alaska Beauty"
            className="h-30 w-auto"
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-[#590E1A] transition-opacity hover:opacity-70"
          >
            Inicio
          </Link>

          <Link
            to="/catalogo"
            className="text-sm font-medium text-[#590E1A] transition-opacity hover:opacity-70"
          >
            Catálogo
          </Link>

          <Link
            to="/carrito"
            aria-label="Ver carrito"
            className="relative flex items-center justify-center rounded-full p-2 text-[#590E1A] transition-colors hover:bg-[#590E1A]/10"
          >
            <ShoppingBag size={21} strokeWidth={1.8} />

            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#590E1A] px-1 text-[10px] font-semibold text-white">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 md:hidden">
          <Link
            to="/carrito"
            aria-label="Ver carrito"
            className="relative flex items-center justify-center rounded-lg p-2 text-[#590E1A] transition-colors hover:bg-[#590E1A]/10"
          >
            <ShoppingBag size={24} strokeWidth={1.8} />

            {totalItems > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#590E1A] px-1 text-[10px] font-semibold text-white">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-[#590E1A] transition-colors hover:bg-[#590E1A]/10"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X size={26} strokeWidth={1.8} />
            ) : (
              <Menu size={26} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <nav className="absolute left-0 right-0 z-50 border-t border-[#590E1A]/10 bg-[#E6B7BB]/10 px-4 py-4 shadow-lg backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            <Link
              to="/"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-[#590E1A] transition-colors hover:bg-[#590E1A]/10"
            >
              Inicio
            </Link>

            <Link
              to="/catalogo"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-[#590E1A] transition-colors hover:bg-[#590E1A]/10"
            >
              Catálogo
            </Link>

            <Link
              to="/carrito"
              onClick={closeMenu}
              className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-[#590E1A] transition-colors hover:bg-[#590E1A]/10"
            >
              <span>Carrito</span>

              {totalItems > 0 && (
                <span className="rounded-full bg-[#590E1A] px-2 py-0.5 text-[10px] font-semibold text-white">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Header