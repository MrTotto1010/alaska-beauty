
import { api } from './api'
import type { Product } from '../types/product'

interface ProductPayload {
  id_categoria: number
  nombre: string
  marca: string | null
  descripcion: string
  precio: number
  disponibilidad: number
}

function getAuthHeaders() {
  const token = localStorage.getItem('alaska_admin_token')

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

function getDeleteHeaders() {
  const token = localStorage.getItem('alaska_admin_token')

  return {
    Authorization: `Bearer ${token}`,
  }
}

async function getErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  const text = await response.text()

  if (!text.trim()) {
    return fallback
  }

  try {
    const data = JSON.parse(text)

    return data?.message || fallback
  } catch {
    return fallback
  }
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${api.baseUrl}/catalogo/productos`)

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'No se pudieron cargar los productos.'
      )
    )
  }

  const data = await response.json()

  const items = Array.isArray(data.items)
    ? data.items
    : Array.isArray(data.productos)
      ? data.productos
      : []

  return items.map((product: Product) => {
    let imagenes = []

    if (Array.isArray(product.imagenes)) {
      imagenes = product.imagenes
    } else if (typeof product.imagenes === 'string') {
      try {
        const parsedImages = JSON.parse(product.imagenes)

        if (Array.isArray(parsedImages)) {
          imagenes = parsedImages
        }
      } catch {
        imagenes = []
      }
    }

    return {
      ...product,
      marca: product.marca ?? null,
      imagenes,
    }
  })
}

export async function createProduct(
  product: ProductPayload
): Promise<void> {
  const response = await fetch(`${api.baseUrl}/admin/productos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'No se pudo crear el producto.'
      )
    )
  }
}

export async function updateProduct(
  id: number,
  product: ProductPayload
): Promise<void> {
  const response = await fetch(`${api.baseUrl}/admin/productos/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'No se pudo actualizar el producto.'
      )
    )
  }
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${api.baseUrl}/admin/productos/${id}`, {
    method: 'DELETE',
    headers: getDeleteHeaders(),
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'No se pudo eliminar el producto.'
      )
    )
  }
}