import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { getCategories, getProducts } from '../../services/catalog.service'
import type { Product } from '../../types/product'
import type { Category } from '../../types/category'
import ProductCard from '../../components/catalog/ProductCard'

const PRODUCTS_PER_PAGE = 20

function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    null,
  )
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  /*
   * Load all products and categories once.
   */
  useEffect(() => {
    let isMounted = true

    Promise.all([getProducts(), getCategories()])
      .then(([productsData, categoriesData]) => {
        if (!isMounted) return

        setProducts(productsData)
        setCategories(categoriesData)
      })
      .catch(() => {
        if (!isMounted) return

        setError(true)
        setProducts([])
        setCategories([])
      })
      .finally(() => {
        if (!isMounted) return

        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  /*
   * Apply search and category filters to all products.
   */
  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === null ||
        product.id_categoria === selectedCategory

      const matchesSearch =
        normalizedSearch === '' ||
        product.nombre.toLowerCase().includes(normalizedSearch) ||
        product.descripcion?.toLowerCase().includes(normalizedSearch) ||
        product.marca?.toLowerCase().includes(normalizedSearch)

      return matchesCategory && matchesSearch
    })
  }, [products, selectedCategory, search])

  /*
   * Calculate the total number of frontend pages.
   */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  )

  /*
   * Reset to the first page when the filters change.
   */
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, search])

  /*
   * Keep the current page valid if the filtered results change.
   */
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  /*
   * Get only the products for the current frontend page.
   */
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
    const endIndex = startIndex + PRODUCTS_PER_PAGE

    return filteredProducts.slice(startIndex, endIndex)
  }, [filteredProducts, currentPage])

  /*
   * Change page and scroll to the top.
   */
  const changePage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages)

    setCurrentPage(nextPage)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  /*
   * Generate page buttons.
   */
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  )

  return (
    <section className="min-h-[calc(100vh-5rem)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B88A44]">
            Alaska Beauty
          </p>

          <h1 className="mt-2 font-serif text-4xl text-[#590E1A] sm:text-5xl">
            Nuestra colección
          </h1>

          <p className="mt-3 max-w-2xl text-[#590E1A]/60">
            Explora nuestra selección de productos de belleza.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-xl">
            <Search
              size={19}
              strokeWidth={1.8}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#590E1A]/45"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar productos..."
              className="w-full rounded-full border border-[#590E1A]/10 bg-white py-3 pl-11 pr-5 text-sm text-[#590E1A] outline-none transition-all placeholder:text-[#590E1A]/40 focus:border-[#B88A44]/60 focus:ring-2 focus:ring-[#B88A44]/10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10 overflow-x-auto pb-2">
          <div className="flex min-w-max gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-[#590E1A] text-white shadow-sm'
                  : 'bg-[#E6B7BB]/30 text-[#590E1A] hover:bg-[#E6B7BB]/60'
              }`}
            >
              Todos
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[#590E1A] text-white shadow-sm'
                    : 'bg-[#E6B7BB]/30 text-[#590E1A] hover:bg-[#E6B7BB]/60'
                }`}
              >
                {category.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-[#590E1A]/60">
            Cargando productos...
          </p>
        )}

        {/* Error */}
        {error && !loading && (
          <p className="text-red-600">
            No pudimos cargar los productos.
          </p>
        )}

        {/* Products */}
        {!loading && !error && (
          <>
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav
                    className="mt-12 flex flex-wrap items-center justify-center gap-2"
                    aria-label="Navegación de páginas"
                  >
                    {/* Previous page */}
                    <button
                      type="button"
                      onClick={() => changePage(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Página anterior"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#590E1A]/10 text-[#590E1A] transition-all hover:bg-[#E6B7BB]/30 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {/* Page numbers */}
                    {pageNumbers.map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => changePage(pageNumber)}
                        aria-label={`Ir a la página ${pageNumber}`}
                        aria-current={
                          currentPage === pageNumber
                            ? 'page'
                            : undefined
                        }
                        className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium transition-all ${
                          currentPage === pageNumber
                            ? 'bg-[#590E1A] text-white shadow-sm'
                            : 'border border-[#590E1A]/10 text-[#590E1A] hover:bg-[#E6B7BB]/30'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}

                    {/* Next page */}
                    <button
                      type="button"
                      onClick={() => changePage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Página siguiente"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#590E1A]/10 text-[#590E1A] transition-all hover:bg-[#E6B7BB]/30 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <div className="py-16 text-center">
                <p className="font-serif text-2xl text-[#590E1A]">
                  No encontramos productos
                </p>

                <p className="mt-2 text-sm text-[#590E1A]/50">
                  Intenta con otra búsqueda o categoría.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default Catalog