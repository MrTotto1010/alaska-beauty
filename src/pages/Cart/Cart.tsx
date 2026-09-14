import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { generateQuotePdf } from '../../services/quote.service'

function Cart() {
  const [quoteGenerated, setQuoteGenerated] = useState(false)

  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCart()

  const handleQuote = () => {
    generateQuotePdf(items, totalPrice)
    setQuoteGenerated(true)
  }

  const handleWhatsApp = () => {
    const productsMessage = items
      .map(
        (item) =>
          `• ${item.product.nombre} x${item.cantidad} — $${(
            item.product.precio * item.cantidad
          ).toLocaleString('es-CO')}`
      )
      .join('\n')

    const message = [
      'Hola, quisiera consultar por estos productos de Alaska Beauty:',
      '',
      productsMessage,
      '',
      `Total estimado: $${totalPrice.toLocaleString('es-CO')}`,
      '',
      'Adjunto la cotización en PDF.',
    ].join('\n')

    const whatsappUrl = `https://wa.me/573134881885?text=${encodeURIComponent(
      message
    )}`

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  if (items.length === 0) {
    return (
      <section className="min-h-[calc(100vh-5rem)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#590E1A]/60 transition-opacity hover:opacity-70"
          >
            <ArrowLeft size={16} />
            Volver al catálogo
          </Link>

          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E6B7BB]/30 text-[#590E1A]">
              <ShoppingBag size={32} strokeWidth={1.5} />
            </div>

            <h1 className="mt-6 font-serif text-3xl text-[#590E1A] sm:text-4xl">
              Tu carrito está vacío
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-[#590E1A]/55">
              Agrega algunos productos de nuestra colección para
              comenzar tu cotización.
            </p>

            <Link
              to="/catalogo"
              className="mt-7 rounded-full bg-[#590E1A] px-7 py-3 text-sm font-medium text-white transition-all hover:scale-[1.01] hover:shadow-lg"
            >
              Explorar productos
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#590E1A]/60 transition-opacity hover:opacity-70"
        >
          <ArrowLeft size={16} />
          Seguir comprando
        </Link>

        <div className="mt-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B88A44]">
            Alaska Beauty
          </p>

          <h1 className="mt-2 font-serif text-4xl text-[#590E1A] sm:text-5xl">
            Tu carrito
          </h1>

          <p className="mt-3 text-sm text-[#590E1A]/55">
            {totalItems}{' '}
            {totalItems === 1
              ? 'producto seleccionado'
              : 'productos seleccionados'}
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Productos */}
          <div className="space-y-4">
            {items.map((item) => {
              const image = item.product.imagenes[0]?.url
              const subtotal = item.product.precio * item.cantidad

              return (
                <div
                  key={item.product.id}
                  className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm sm:gap-5 sm:p-5"
                >
                  {/* Imagen */}
                  <Link
                    to={`/producto/${item.product.id}`}
                    className="h-28 w-22 shrink-0 overflow-hidden rounded-xl bg-[#F7E9EA] sm:h-36 sm:w-28"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={item.product.nombre}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-[#590E1A]/40">
                        Sin imagen
                      </div>
                    )}
                  </Link>

                  {/* Información */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wider text-[#B88A44]">
                          {item.product.categoria}
                        </p>

                        {/* Marca */}
                        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[#590E1A]/50">
                          {item.product.marca || 'Sin marca'}
                        </p>

                        <Link
                          to={`/producto/${item.product.id}`}
                          className="mt-1 block truncate text-base font-semibold text-[#590E1A] transition-opacity hover:opacity-70 sm:text-lg"
                        >
                          {item.product.nombre}
                        </Link>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        aria-label={`Eliminar ${item.product.nombre}`}
                        className="shrink-0 text-[#590E1A]/35 transition-colors hover:text-red-600"
                      >
                        <Trash2 size={18} strokeWidth={1.8} />
                      </button>
                    </div>

                    {/* Cantidad + Precio */}
                    <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
                      {/* Cantidad */}
                      <div className="flex items-center rounded-full border border-[#590E1A]/10">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.cantidad - 1
                            )
                          }
                          aria-label="Disminuir cantidad"
                          className="flex h-9 w-9 items-center justify-center text-[#590E1A]/60 transition-colors hover:text-[#590E1A]"
                        >
                          <Minus size={15} />
                        </button>

                        <span className="w-7 text-center text-sm font-medium text-[#590E1A]">
                          {item.cantidad}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.cantidad + 1
                            )
                          }
                          aria-label="Aumentar cantidad"
                          className="flex h-9 w-9 items-center justify-center text-[#590E1A]/60 transition-colors hover:text-[#590E1A]"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      {/* Precio */}
                      <div className="text-right">
                        <p className="text-xs text-[#590E1A]/45">
                          $
                          {item.product.precio.toLocaleString('es-CO')}{' '}
                          c/u
                        </p>

                        <p className="mt-1 text-base font-semibold text-[#590E1A]">
                          ${subtotal.toLocaleString('es-CO')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Resumen */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-[#F7E9EA]/60 p-6 sm:p-7">
              <h2 className="font-serif text-2xl text-[#590E1A]">
                Resumen
              </h2>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between text-[#590E1A]/60">
                  <span>Productos</span>
                  <span>{totalItems}</span>
                </div>

                <div className="h-px bg-[#590E1A]/10" />

                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#590E1A]">
                    Total estimado
                  </span>

                  <span className="text-lg font-semibold text-[#590E1A]">
                    ${totalPrice.toLocaleString('es-CO')}
                  </span>
                </div>
              </div>

              <p className="mt-5 text-xs leading-5 text-[#590E1A]/50">
                Este monto es una referencia para tu cotización.
                El pago se coordinará directamente con Alaska Beauty.
              </p>

              <button
                type="button"
                onClick={handleQuote}
                className="mt-6 w-full rounded-full bg-[#590E1A] px-6 py-3.5 text-sm font-medium text-white transition-all hover:scale-[1.01] hover:shadow-lg"
              >
                Consultar cotización
              </button>

              {/* Confirmación de cotización */}
              {quoteGenerated && (
                <div className="mt-5 rounded-2xl border border-[#B88A44]/20 bg-white p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E6B7BB]/30 text-[#590E1A]">
                      ✓
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-[#590E1A]">
                        ¡Cotización generada!
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-[#590E1A]/55">
                        Tu cotización en PDF está lista. Continúa
                        por WhatsApp para consultar disponibilidad
                        y coordinar tu compra.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="mt-4 w-full rounded-full bg-[#590E1A] px-5 py-3 text-sm font-medium text-white transition-all hover:scale-[1.01] hover:shadow-lg"
                  >
                    Continuar por WhatsApp →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cart