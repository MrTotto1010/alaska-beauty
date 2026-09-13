import { api } from './api'
import type { Category } from '../types/category'

interface CategoryPayload {
  nombre: string
  descripcion: string
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

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${api.baseUrl}/catalogo/categorias`)

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'No se pudieron cargar las categorías.'
      )
    )
  }

  const data = await response.json()

  return data.categorias
}

export async function createCategory(
  category: CategoryPayload
): Promise<void> {
  const response = await fetch(`${api.baseUrl}/admin/categorias`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(category),
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'No se pudo crear la categoría.'
      )
    )
  }
}

export async function updateCategory(
  id: number,
  category: CategoryPayload
): Promise<void> {
  const response = await fetch(`${api.baseUrl}/admin/categorias/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(category),
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'No se pudo actualizar la categoría.'
      )
    )
  }
}

export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`${api.baseUrl}/admin/categorias/${id}`, {
    method: 'DELETE',
    headers: getDeleteHeaders(),
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'No se pudo eliminar la categoría.'
      )
    )
  }
}