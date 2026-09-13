import { api } from './api'

interface ImagePayload {
  id_producto: number
  url_imagen: string
  orden: number
}

interface UpdateImagePayload {
  id_producto: number
  url_imagen: string
  orden: number
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

export async function createProductImage(
  image: ImagePayload
): Promise<void> {
  const response = await fetch(`${api.baseUrl}/admin/imagenes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(image),
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'No se pudo agregar la imagen.'
      )
    )
  }
}

export async function updateProductImage(
  id: number,
  image: UpdateImagePayload
): Promise<void> {
  const response = await fetch(`${api.baseUrl}/admin/imagenes/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(image),
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'No se pudo actualizar la imagen.'
      )
    )
  }
}

export async function deleteProductImage(id: number): Promise<void> {
  const response = await fetch(`${api.baseUrl}/admin/imagenes/${id}`, {
    method: 'DELETE',
    headers: getDeleteHeaders(),
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'No se pudo eliminar la imagen.'
      )
    )
  }
}