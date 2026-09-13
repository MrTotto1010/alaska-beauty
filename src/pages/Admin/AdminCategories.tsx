import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Tag,
} from 'lucide-react'
import type { Category } from '../../types/category'
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../../services/category.service'

function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar las categorías.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const openCreateModal = () => {
    setEditingCategory(null)
    setNombre('')
    setDescripcion('')
    setError('')
    setModalOpen(true)
  }

  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    setNombre(category.nombre)
    setDescripcion(category.descripcion ?? '')
    setError('')
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return

    setModalOpen(false)
    setEditingCategory(null)
    setNombre('')
    setDescripcion('')
    setError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!nombre.trim()) {
      setError('El nombre de la categoría es obligatorio.')
      return
    }

    try {
      setSaving(true)
      setError('')

      const payload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
      }

      if (editingCategory) {
        await updateCategory(editingCategory.id, payload)
      } else {
        await createCategory(payload)
      }

      await loadCategories()
      closeModal()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo guardar la categoría.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar la categoría "${category.nombre}"?`
    )

    if (!confirmed) return

    try {
      setError('')

      await deleteCategory(category.id)
      await loadCategories()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar la categoría.'
      )
    }
  }

  const filteredCategories = categories.filter((category) =>
    category.nombre.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#B88A44]">
            Catálogo
          </p>

          <h1 className="mt-1 font-serif text-3xl text-[#590E1A]">
            Categorías
          </h1>

          <p className="mt-2 text-sm text-[#590E1A]/60">
            Administra las categorías de productos de Alaska Beauty.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#590E1A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#741827]"
        >
          <Plus size={18} />
          Nueva categoría
        </button>
      </div>

      {error && !modalOpen && (
        <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#590E1A]/40"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar categoría..."
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
                Cargando categorías...
              </p>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7E9EA] text-[#590E1A]">
              <Tag size={24} />
            </div>

            <h2 className="mt-4 font-serif text-2xl text-[#590E1A]">
              No hay categorías
            </h2>

            <p className="mt-2 max-w-md text-sm text-[#590E1A]/60">
              {search
                ? 'No encontramos categorías que coincidan con tu búsqueda.'
                : 'Crea tu primera categoría para comenzar a organizar el catálogo.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="border-b border-[#E6B7BB]/30 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#590E1A]/50">
                    Categoría
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#590E1A]/50">
                    Descripción
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#590E1A]/50">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-[#E6B7BB]/20 last:border-b-0"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7E9EA] text-[#590E1A]">
                          <Tag size={18} />
                        </div>

                        <div>
                          <p className="font-medium text-[#590E1A]">
                            {category.nombre}
                          </p>

                          <p className="text-xs text-[#590E1A]/40">
                            ID #{category.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="max-w-md px-6 py-5 text-sm text-[#590E1A]/60">
                      {category.descripcion || 'Sin descripción'}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(category)}
                          className="rounded-xl p-2.5 text-[#590E1A]/60 transition hover:bg-[#F7E9EA] hover:text-[#590E1A]"
                          aria-label={`Editar ${category.nombre}`}
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          className="rounded-xl p-2.5 text-red-500 transition hover:bg-red-50"
                          aria-label={`Eliminar ${category.nombre}`}
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
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6 py-8 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E6B7BB]/30 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#B88A44]">
                  {editingCategory ? 'Editar' : 'Crear'}
                </p>

                <h2 className="mt-1 font-serif text-2xl text-[#590E1A]">
                  {editingCategory
                    ? 'Editar categoría'
                    : 'Nueva categoría'}
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
              <div>
                <label
                  htmlFor="category-name"
                  className="mb-2 block text-sm font-medium text-[#590E1A]"
                >
                  Nombre
                </label>

                <input
                  id="category-name"
                  type="text"
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                  placeholder="Ej. Rostro"
                  required
                  className="w-full rounded-xl border border-[#E6B7BB]/60 px-4 py-3 text-sm text-[#590E1A] outline-none transition focus:border-[#590E1A] focus:ring-2 focus:ring-[#E6B7BB]/30"
                />
              </div>

              <div>
                <label
                  htmlFor="category-description"
                  className="mb-2 block text-sm font-medium text-[#590E1A]"
                >
                  Descripción
                </label>

                <textarea
                  id="category-description"
                  value={descripcion}
                  onChange={(event) => setDescripcion(event.target.value)}
                  placeholder="Describe brevemente la categoría..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[#E6B7BB]/60 px-4 py-3 text-sm text-[#590E1A] outline-none transition focus:border-[#590E1A] focus:ring-2 focus:ring-[#E6B7BB]/30"
                />
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
                    : editingCategory
                      ? 'Guardar cambios'
                      : 'Crear categoría'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCategories