import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Package,
  Image as ImageIcon,
  Link,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react'
import type { Product, ProductImage } from '../../types/product'
import type { Category } from '../../types/category'
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../../services/product.service'
import { getCategories } from '../../services/category.service'
import {
  createProductImage,
  deleteProductImage,
  updateProductImage,
} from '../../services/image.service'

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const PRODUCTS_PER_PAGE = 20
  const [currentPage, setCurrentPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [nombre, setNombre] = useState('')
  const [marca, setMarca] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [idCategoria, setIdCategoria] = useState('')
  const [disponibilidad, setDisponibilidad] = useState(true)

  const [imagesModalOpen, setImagesModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const [imageUrl, setImageUrl] = useState('')
  const [imageOrder, setImageOrder] = useState('1')
  const [editingImageId, setEditingImageId] = useState<number | null>(null)
  const [editingImageUrl, setEditingImageUrl] = useState('')
  const [editingImageOrder, setEditingImageOrder] = useState('1')
  const [imageSaving, setImageSaving] = useState(false)
  const [imageError, setImageError] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ])

      setProducts(productsData)
      setCategories(categoriesData)

      if (selectedProduct) {
        const updatedProduct = productsData.find(
          (product) => product.id === selectedProduct.id
        )

        if (updatedProduct) {
          setSelectedProduct(updatedProduct)
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar los datos.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const openCreateModal = () => {
    setEditingProduct(null)
    setNombre('')
    setMarca('')
    setDescripcion('')
    setPrecio('')
    setIdCategoria('')
    setDisponibilidad(true)
    setError('')
    setModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setNombre(product.nombre)
    setMarca(product.marca ?? '')
    setDescripcion(product.descripcion ?? '')
    setPrecio(String(product.precio))
    setIdCategoria(String(product.id_categoria))
    setDisponibilidad(product.disponibilidad === 1)
    setError('')
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return

    setModalOpen(false)
    setEditingProduct(null)
    setNombre('')
    setMarca('')
    setDescripcion('')
    setPrecio('')
    setIdCategoria('')
    setDisponibilidad(true)
    setError('')
  }

  const openImagesModal = (product: Product) => {
    setSelectedProduct(product)
    setImageUrl('')
    setImageOrder(
      String(
        product.imagenes.length > 0
          ? Math.max(...product.imagenes.map((image) => image.orden)) + 1
          : 1
      )
    )
    setEditingImageId(null)
    setEditingImageUrl('')
    setEditingImageOrder('1')
    setImageError('')
    setImagesModalOpen(true)
  }

  const closeImagesModal = () => {
    if (imageSaving) return

    setImagesModalOpen(false)
    setSelectedProduct(null)
    setImageUrl('')
    setImageOrder('1')
    setEditingImageId(null)
    setEditingImageUrl('')
    setEditingImageOrder('1')
    setImageError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError('')

    if (!nombre.trim()) {
      setError('El nombre del producto es obligatorio.')
      return
    }

    if (!idCategoria) {
      setError('Debes seleccionar una categoría.')
      return
    }

    const numericPrice = Number(precio)

    if (!precio || Number.isNaN(numericPrice) || numericPrice < 0) {
      setError('Debes ingresar un precio válido.')
      return
    }

    try {
      setSaving(true)

      const payload = {
        id_categoria: Number(idCategoria),
        nombre: nombre.trim(),
        marca: marca.trim() || null,
        descripcion: descripcion.trim(),
        precio: numericPrice,
        disponibilidad: disponibilidad ? 1 : 0,
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload)
      } else {
        await createProduct(payload)
      }

      await loadData()
      closeModal()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo guardar el producto.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${product.nombre}"?`
    )

    if (!confirmed) return

    try {
      setError('')

      await deleteProduct(product.id)
      await loadData()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar el producto.'
      )
    }
  }

  const handleAddImage = async () => {
    if (!selectedProduct) return

    if (!imageUrl.trim()) {
      setImageError('Debes ingresar la URL de la imagen.')
      return
    }

    const numericOrder = Number(imageOrder)

    if (!imageOrder || Number.isNaN(numericOrder) || numericOrder < 1) {
      setImageError('Debes ingresar un orden válido.')
      return
    }

    try {
      setImageSaving(true)
      setImageError('')

      await createProductImage({
        id_producto: selectedProduct.id,
        url_imagen: imageUrl.trim(),
        orden: numericOrder,
      })

      setImageUrl('')
      setImageOrder(
        String(
          Math.max(
            ...selectedProduct.imagenes.map((image) => image.orden),
            numericOrder
          ) + 1
        )
      )

      await loadData()
    } catch (err) {
      setImageError(
        err instanceof Error
          ? err.message
          : 'No se pudo agregar la imagen.'
      )
    } finally {
      setImageSaving(false)
    }
  }

  const startEditImage = (image: ProductImage) => {
    setEditingImageId(image.id)
    setEditingImageUrl(image.url)
    setEditingImageOrder(String(image.orden))
    setImageError('')
  }

  const cancelEditImage = () => {
    setEditingImageId(null)
    setEditingImageUrl('')
    setEditingImageOrder('1')
  }

  const handleUpdateImage = async () => {
    if (!editingImageId || !selectedProduct) return

    if (!editingImageUrl.trim()) {
      setImageError('La URL de la imagen es obligatoria.')
      return
    }

    const numericOrder = Number(editingImageOrder)

    if (
      !editingImageOrder ||
      Number.isNaN(numericOrder) ||
      numericOrder < 1
    ) {
      setImageError('Debes ingresar un orden válido.')
      return
    }

    try {
      setImageSaving(true)
      setImageError('')

      await updateProductImage(editingImageId, {
        id_producto: selectedProduct.id,
        url_imagen: editingImageUrl.trim(),
        orden: numericOrder,
      })

      cancelEditImage()
      await loadData()
    } catch (err) {
      setImageError(
        err instanceof Error
          ? err.message
          : 'No se pudo actualizar la imagen.'
      )
    } finally {
      setImageSaving(false)
    }
  }

  const handleDeleteImage = async (image: ProductImage) => {
    const confirmed = window.confirm(
      '¿Seguro que deseas eliminar esta imagen?'
    )

    if (!confirmed) return

    try {
      setImageSaving(true)
      setImageError('')

      await deleteProductImage(image.id)
      await loadData()
    } catch (err) {
      setImageError(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar la imagen.'
      )
    } finally {
      setImageSaving(false)
    }
  }

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return products
    }

    return products.filter((product) => {
      return (
        product.nombre.toLowerCase().includes(query) ||
        (product.marca ?? '').toLowerCase().includes(query) ||
        product.categoria.toLowerCase().includes(query)
      )
    })
  }, [products, search])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  )

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
    const endIndex = startIndex + PRODUCTS_PER_PAGE

    return filteredProducts.slice(startIndex, endIndex)
  }, [filteredProducts, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  /*
   * Generate the three visible page numbers.
   *
   * Page 1  -> 1 2 3
   * Page 2  -> 1 2 3
   * Page 3  -> 2 3 4
   * Page 4  -> 3 4 5
   * ...
   * Page 27 -> 26 27 28
   * Page 28 -> 27 28 29
   * Page 29 -> 27 28 29
   */
  const visiblePages = useMemo(() => {
    if (totalPages <= 3) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      )
    }

    if (currentPage <= 2) {
      return [1, 2, 3]
    }

    if (currentPage >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages]
    }

    return [currentPage - 1, currentPage, currentPage + 1]
  }, [currentPage, totalPages])

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value)

  const selectedImages = selectedProduct
    ? [...selectedProduct.imagenes].sort((a, b) => a.orden - b.orden)
    : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#B88A44]">
            Catálogo
          </p>

          <h1 className="mt-1 font-serif text-3xl text-[#590E1A]">
            Productos
          </h1>

          <p className="mt-2 text-sm text-[#590E1A]/60">
            Administra los productos disponibles en la tienda.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#590E1A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#741827]"
        >
          <Plus size={18} />
          Nuevo producto
        </button>
      </div>

      {error && !modalOpen && !imagesModalOpen && (
        <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
        <div className="relative max-w-lg">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#590E1A]/40"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar producto, marca o categoría..."
            className="w-full rounded-xl border border-[#E6B7BB]/50 bg-[#FDF8F8] py-3 pl-11 pr-4 text-sm text-[#590E1A] outline-none transition focus:border-[#590E1A]"
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#E6B7BB] border-t-[#590E1A]" />

              <p className="mt-4 text-sm text-[#590E1A]/60">
                Cargando productos...
              </p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7E9EA] text-[#590E1A]">
              <Package size={24} />
            </div>

            <h2 className="mt-4 font-serif text-2xl text-[#590E1A]">
              No hay productos
            </h2>

            <p className="mt-2 max-w-md text-sm text-[#590E1A]/60">
              {search
                ? 'No encontramos productos que coincidan con tu búsqueda.'
                : 'Crea tu primer producto para comenzar a llenar el catálogo.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px]">
                <thead>
                  <tr className="border-b border-[#E6B7BB]/30 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#590E1A]/50">
                      Producto
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#590E1A]/50">
                      Marca
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#590E1A]/50">
                      Categoría
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#590E1A]/50">
                      Precio
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#590E1A]/50">
                      Estado
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#590E1A]/50">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-[#E6B7BB]/20 last:border-b-0"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#F7E9EA]">
                            {product.imagenes.length > 0 ? (
                              <img
                                src={product.imagenes[0].url}
                                alt={product.nombre}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[#590E1A]/40">
                                <ImageIcon size={22} />
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-[#590E1A]">
                              {product.nombre}
                            </p>

                            <p className="mt-1 text-xs text-[#590E1A]/40">
                              ID #{product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-[#590E1A]/60">
                        {product.marca || 'Sin marca'}
                      </td>

                      <td className="px-6 py-5 text-sm text-[#590E1A]/60">
                        {product.categoria}
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-[#590E1A]">
                        {formatPrice(product.precio)}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            product.disponibilidad === 1
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {product.disponibilidad === 1
                            ? 'Disponible'
                            : 'No disponible'}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openImagesModal(product)}
                            className="rounded-xl p-2.5 text-[#590E1A]/60 transition hover:bg-[#F7E9EA] hover:text-[#590E1A]"
                            aria-label={`Gestionar imágenes de ${product.nombre}`}
                            title="Gestionar imágenes"
                          >
                            <ImageIcon size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            className="rounded-xl p-2.5 text-[#590E1A]/60 transition hover:bg-[#F7E9EA] hover:text-[#590E1A]"
                            aria-label={`Editar ${product.nombre}`}
                            title="Editar producto"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            className="rounded-xl p-2.5 text-red-500 transition hover:bg-red-50"
                            aria-label={`Eliminar ${product.nombre}`}
                            title="Eliminar producto"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col gap-4 border-t border-[#E6B7BB]/30 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#590E1A]/60">
                  Mostrando{' '}
                  <span className="font-medium text-[#590E1A]">
                    {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}
                  </span>{' '}
                  a{' '}
                  <span className="font-medium text-[#590E1A]">
                    {Math.min(
                      currentPage * PRODUCTS_PER_PAGE,
                      filteredProducts.length
                    )}
                  </span>{' '}
                  de{' '}
                  <span className="font-medium text-[#590E1A]">
                    {filteredProducts.length}
                  </span>{' '}
                  productos
                </p>

                <div className="flex items-center justify-center gap-1.5 sm:justify-end">
                  {/* First page */}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    aria-label="Ir a la primera página"
                    title="Primera página"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E6B7BB] text-[#590E1A] transition hover:bg-[#FDF3F4] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronsLeft size={17} />
                  </button>

                  {/* Previous page */}
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                    title="Página anterior"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E6B7BB] text-[#590E1A] transition hover:bg-[#FDF3F4] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft size={17} />
                  </button>

                  {/* Page numbers */}
                  {visiblePages.map((page) => {
                    const isCurrentPage = currentPage === page

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        aria-label={`Ir a la página ${page}`}
                        aria-current={
                          isCurrentPage ? 'page' : undefined
                        }
                        className={`flex shrink-0 items-center justify-center rounded-full font-medium transition-all ${
                          isCurrentPage
                            ? 'h-12 w-12 bg-[#590E1A] text-base text-white shadow-sm'
                            : 'h-10 w-10 border border-[#E6B7BB] text-sm text-[#590E1A] hover:bg-[#FDF3F4]'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}

                  {/* Next page */}
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1)
                      )
                    }
                    disabled={currentPage === totalPages}
                    aria-label="Página siguiente"
                    title="Página siguiente"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E6B7BB] text-[#590E1A] transition hover:bg-[#FDF3F4] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronRight size={17} />
                  </button>

                  {/* Last page */}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="Ir a la última página"
                    title="Última página"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E6B7BB] text-[#590E1A] transition hover:bg-[#FDF3F4] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronsRight size={17} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 px-6 py-8 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E6B7BB]/30 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#B88A44]">
                  {editingProduct ? 'Editar' : 'Crear'}
                </p>

                <h2 className="mt-1 font-serif text-2xl text-[#590E1A]">
                  {editingProduct ? 'Editar producto' : 'Nuevo producto'}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-full p-2 text-[#590E1A]/60 transition hover:bg-[#F7E9EA] hover:text-[#590E1A] disabled:opacity-40"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="product-name"
                    className="mb-2 block text-sm font-medium text-[#590E1A]"
                  >
                    Nombre
                  </label>

                  <input
                    id="product-name"
                    type="text"
                    value={nombre}
                    onChange={(event) => setNombre(event.target.value)}
                    placeholder="Ej. Base Líquida"
                    required
                    className="w-full rounded-xl border border-[#E6B7BB]/60 px-4 py-3 text-sm text-[#590E1A] outline-none transition focus:border-[#590E1A] focus:ring-2 focus:ring-[#E6B7BB]/30"
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-brand"
                    className="mb-2 block text-sm font-medium text-[#590E1A]"
                  >
                    Marca{' '}
                    <span className="font-normal text-[#590E1A]/50">
                      (opcional)
                    </span>
                  </label>

                  <input
                    id="product-brand"
                    type="text"
                    value={marca}
                    onChange={(event) => setMarca(event.target.value)}
                    placeholder="Ej. Samy"
                    className="w-full rounded-xl border border-[#E6B7BB]/60 px-4 py-3 text-sm text-[#590E1A] outline-none transition focus:border-[#590E1A] focus:ring-2 focus:ring-[#E6B7BB]/30"
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-category"
                    className="mb-2 block text-sm font-medium text-[#590E1A]"
                  >
                    Categoría
                  </label>

                  <select
                    id="product-category"
                    value={idCategoria}
                    onChange={(event) => setIdCategoria(event.target.value)}
                    required
                    className="w-full rounded-xl border border-[#E6B7BB]/60 bg-white px-4 py-3 text-sm text-[#590E1A] outline-none transition focus:border-[#590E1A] focus:ring-2 focus:ring-[#E6B7BB]/30"
                  >
                    <option value="">Selecciona una categoría</option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="product-price"
                    className="mb-2 block text-sm font-medium text-[#590E1A]"
                  >
                    Precio
                  </label>

                  <input
                    id="product-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={precio}
                    onChange={(event) => setPrecio(event.target.value)}
                    placeholder="8500"
                    required
                    className="w-full rounded-xl border border-[#E6B7BB]/60 px-4 py-3 text-sm text-[#590E1A] outline-none transition focus:border-[#590E1A] focus:ring-2 focus:ring-[#E6B7BB]/30"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="product-description"
                    className="mb-2 block text-sm font-medium text-[#590E1A]"
                  >
                    Descripción
                  </label>

                  <textarea
                    id="product-description"
                    value={descripcion}
                    onChange={(event) => setDescripcion(event.target.value)}
                    placeholder="Describe brevemente el producto..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-[#E6B7BB]/60 px-4 py-3 text-sm text-[#590E1A] outline-none transition focus:border-[#590E1A] focus:ring-2 focus:ring-[#E6B7BB]/30"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E6B7BB]/40 px-4 py-4">
                    <input
                      type="checkbox"
                      checked={disponibilidad}
                      onChange={(event) =>
                        setDisponibilidad(event.target.checked)
                      }
                      className="h-4 w-4 accent-[#590E1A]"
                    />

                    <div>
                      <p className="text-sm font-medium text-[#590E1A]">
                        Producto disponible
                      </p>

                      <p className="mt-1 text-xs text-[#590E1A]/50">
                        El producto aparecerá como disponible en el catálogo.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-full border border-[#E6B7BB] px-5 py-3 text-sm font-medium text-[#590E1A] transition hover:bg-[#FDF3F4] disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-[#590E1A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#741827] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? 'Guardando...'
                    : editingProduct
                      ? 'Guardar cambios'
                      : 'Crear producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {imagesModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 px-6 py-8 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E6B7BB]/30 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#B88A44]">
                  Imágenes
                </p>

                <h2 className="mt-1 font-serif text-2xl text-[#590E1A]">
                  {selectedProduct.nombre}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeImagesModal}
                disabled={imageSaving}
                className="rounded-full p-2 text-[#590E1A]/60 transition hover:bg-[#F7E9EA] hover:text-[#590E1A] disabled:opacity-40"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="rounded-2xl bg-[#FDF8F8] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Link size={18} className="text-[#590E1A]" />

                  <h3 className="font-medium text-[#590E1A]">
                    Agregar imagen
                  </h3>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_120px_auto]">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(event) => setImageUrl(event.target.value)}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full rounded-xl border border-[#E6B7BB]/60 bg-white px-4 py-3 text-sm text-[#590E1A] outline-none transition focus:border-[#590E1A] focus:ring-2 focus:ring-[#E6B7BB]/30"
                  />

                  <input
                    type="number"
                    min="1"
                    value={imageOrder}
                    onChange={(event) => setImageOrder(event.target.value)}
                    placeholder="Orden"
                    className="w-full rounded-xl border border-[#E6B7BB]/60 bg-white px-4 py-3 text-sm text-[#590E1A] outline-none transition focus:border-[#590E1A] focus:ring-2 focus:ring-[#E6B7BB]/30"
                  />

                  <button
                    type="button"
                    onClick={handleAddImage}
                    disabled={imageSaving}
                    className="rounded-full bg-[#590E1A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#741827] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Agregar
                  </button>
                </div>

                <p className="mt-3 text-xs text-[#590E1A]/50">
                  Pega aquí la URL pública de Cloudinary.
                </p>
              </div>

              {imageError && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {imageError}
                </div>
              )}

              {selectedImages.length === 0 ? (
                <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[#E6B7BB] px-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7E9EA] text-[#590E1A]">
                    <ImageIcon size={22} />
                  </div>

                  <h3 className="mt-3 font-serif text-xl text-[#590E1A]">
                    No hay imágenes
                  </h3>

                  <p className="mt-1 text-sm text-[#590E1A]/50">
                    Agrega la primera imagen del producto.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedImages.map((image) => (
                    <div
                      key={image.id}
                      className="rounded-2xl border border-[#E6B7BB]/30 p-4"
                    >
                      {editingImageId === image.id ? (
                        <div className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-[1fr_120px]">
                            <input
                              type="url"
                              value={editingImageUrl}
                              onChange={(event) =>
                                setEditingImageUrl(event.target.value)
                              }
                              className="w-full rounded-xl border border-[#E6B7BB]/60 px-4 py-3 text-sm text-[#590E1A] outline-none transition focus:border-[#590E1A]"
                            />

                            <input
                              type="number"
                              min="1"
                              value={editingImageOrder}
                              onChange={(event) =>
                                setEditingImageOrder(event.target.value)
                              }
                              className="w-full rounded-xl border border-[#E6B7BB]/60 px-4 py-3 text-sm text-[#590E1A] outline-none transition focus:border-[#590E1A]"
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleUpdateImage}
                              disabled={imageSaving}
                              className="rounded-full bg-[#590E1A] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                            >
                              Guardar
                            </button>

                            <button
                              type="button"
                              onClick={cancelEditImage}
                              disabled={imageSaving}
                              className="rounded-full border border-[#E6B7BB] px-5 py-2.5 text-sm font-medium text-[#590E1A]"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                          <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F7E9EA]">
                            <img
                              src={image.url}
                              alt={`${selectedProduct.nombre} ${image.orden}`}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#B88A44]">
                              Orden {image.orden}
                            </p>

                            <p className="mt-1 break-all text-sm text-[#590E1A]/60">
                              {image.url}
                            </p>
                          </div>

                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              onClick={() => startEditImage(image)}
                              className="rounded-xl p-2.5 text-[#590E1A]/60 transition hover:bg-[#F7E9EA] hover:text-[#590E1A]"
                              aria-label="Editar imagen"
                              title="Editar imagen"
                            >
                              <Pencil size={18} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteImage(image)}
                              disabled={imageSaving}
                              className="rounded-xl p-2.5 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                              aria-label="Eliminar imagen"
                              title="Eliminar imagen"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end border-t border-[#E6B7BB]/30 pt-5">
                <button
                  type="button"
                  onClick={closeImagesModal}
                  disabled={imageSaving}
                  className="rounded-full border border-[#E6B7BB] px-5 py-3 text-sm font-medium text-[#590E1A] transition hover:bg-[#FDF3F4] disabled:opacity-50"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts