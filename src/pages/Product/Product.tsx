import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { getProducts } from '../../services/catalog.service'
import type { Product as ProductType } from '../../types/product'
import { useCart } from '../../contexts/CartContext'

function ProductPage() {
  const { id } = useParams()
    const { addToCart } = useCart()

  const [product, setProduct] = useState<ProductType | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    getProducts()
      .then((products) => {
        const foundProduct = products.find(
          (item) => item.id === Number(id)
        )

        if (!foundProduct) {
          setError(true)
          return
        }

        setProduct(foundProduct)
        setSelectedImage(0)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-5rem)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[#590E1A]/60">
            Cargando producto...
          </p>
        </div>
      </section>
    )
  }

  if (error || !product) {
    return (
      <section className="min-h-[calc(100vh-5rem)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#590E1A]/60 transition-opacity hover:opacity-70"
          >
            <ArrowLeft size={16} />
            Volver al catálogo
          </Link>

          <div className="py-20 text-center">
            <h1 className="font-serif text-3xl text-[#590E1A]">
              Producto no encontrado
            </h1>

            <p className="mt-3 text-sm text-[#590E1A]/50">
              El producto que buscas no está disponible.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const images = product.imagenes
  const hasMultipleImages = images.length > 1

  const handlePreviousImage = () => {
    setSelectedImage((current) =>
      current === 0 ? images.length - 1 : current - 1
    )
  }

  const handleNextImage = () => {
    setSelectedImage((current) =>
      current === images.length - 1 ? 0 : current + 1
    )
  }

  const handleAddToCart = () => {
  addToCart(product)
  setAddedToCart(true)

  setTimeout(() => {
    setAddedToCart(false)
  }, 1500)
}

  return (
    <section className="min-h-[calc(100vh-5rem)] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#590E1A]/60 transition-opacity hover:opacity-70"
        >
          <ArrowLeft size={16} />
          Volver al catálogo
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Galería */}
          <div>
            <div className="relative aspect-4/5 w-full max-w-lg overflow-hidden rounded-2xl bg-[#F7E9EA] lg:max-w-md">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[selectedImage].url}
                    alt={product.nombre}
                    className="h-full w-full object-cover"
                  />

                  {hasMultipleImages && (
                    <>
                      <button
                        type="button"
                        onClick={handlePreviousImage}
                        aria-label="Imagen anterior"
                        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#590E1A] shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
                      >
                        <ChevronLeft size={21} strokeWidth={1.8} />
                      </button>

                      <button
                        type="button"
                        onClick={handleNextImage}
                        aria-label="Siguiente imagen"
                        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#590E1A] shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
                      >
                        <ChevronRight size={21} strokeWidth={1.8} />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#590E1A]/40">
                  Sin imagen
                </div>
              )}
            </div>

            {hasMultipleImages && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`Ver imagen ${index + 1}`}
                    className={`h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-24 sm:w-20 ${
                      selectedImage === index
                        ? 'border-[#590E1A]'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.nombre} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#B88A44]">
              {product.categoria}
            </p>

            <h1 className="mt-3 font-serif text-4xl leading-tight text-[#590E1A] sm:text-5xl">
              {product.nombre}
            </h1>

            <p className="mt-5 text-2xl font-semibold text-[#590E1A]">
              ${product.precio.toLocaleString('es-CO')}
            </p>

            <div className="my-6 h-px bg-[#590E1A]/10" />

            <p className="text-base leading-7 text-[#590E1A]/65">
              {product.descripcion}
            </p>

            <p
              className={`mt-6 text-sm font-medium ${
                product.disponibilidad
                  ? 'text-green-700'
                  : 'text-red-600'
              }`}
            >
              {product.disponibilidad
                ? 'Disponible'
                : 'Agotado'}
            </p>

            <button
  type="button"
  disabled={!product.disponibilidad}
  onClick={handleAddToCart}
  className="mt-8 w-full rounded-full bg-[#590E1A] px-7 py-3.5 text-sm font-medium text-white transition-all hover:scale-[1.01] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:w-auto"
>
  {addedToCart ? '✓ Agregado al carrito' : 'Agregar al carrito'}
</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductPage