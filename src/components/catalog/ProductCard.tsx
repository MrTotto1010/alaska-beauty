import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const image = product.imagenes[0]?.url

  return (
    <Link
      to={`/producto/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-4/5 overflow-hidden bg-[#F7E9EA]">
        {image ? (
          <img
            src={image}
            alt={product.nombre}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#590E1A]/40">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-[#B88A44]">
          {product.categoria}
        </p>

        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[#590E1A]/50">
          {product.marca || 'Sin marca'}
        </p>

        <h2 className="mt-2 min-h-[3rem] line-clamp-2 text-base font-semibold leading-6 text-[#590E1A] sm:min-h-[3.5rem] sm:text-lg sm:leading-7">
          {product.nombre}
        </h2>

        <p className="mt-2 h-12 line-clamp-2 text-sm leading-6 text-[#590E1A]/60">
          {product.descripcion}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <p className="text-base font-semibold text-[#590E1A] sm:text-lg">
            ${product.precio.toLocaleString('es-CO')}
          </p>

          <span
            className={`text-xs font-medium ${
              product.disponibilidad
                ? 'text-green-700'
                : 'text-red-600'
            }`}
          >
            {product.disponibilidad ? 'Disponible' : 'Agotado'}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard