import { api } from './api'
import type { Product } from '../types/product'
import type { Category } from '../types/category'

interface ProductsResponse {
  items?: Product[]
  productos?: Product[]
}

interface CategoriesResponse {
  items?: Category[]
  categorias?: Category[]
}

function normalizeProduct(product: Product): Product {
  const productWithImages = product as Product & {
    imagenes?: unknown
  }

  const images = productWithImages.imagenes

  if (typeof images === 'string') {
    try {
      const parsedImages = JSON.parse(images)

      return {
        ...product,
        imagenes: Array.isArray(parsedImages) ? parsedImages : [],
      }
    } catch {
      return {
        ...product,
        imagenes: [],
      }
    }
  }

  return {
    ...product,
    imagenes: Array.isArray(images) ? images : [],
  }
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${api.baseUrl}/catalogo/productos`)

  if (!response.ok) {
    throw new Error('No se pudieron cargar los productos')
  }

  const data: ProductsResponse = await response.json()

  const products = data.items ?? data.productos ?? []

  return products.map(normalizeProduct)
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${api.baseUrl}/catalogo/categorias`)

  if (!response.ok) {
    throw new Error('No se pudieron cargar las categorías')
  }

  const data: CategoriesResponse = await response.json()

  return data.items ?? data.categorias ?? []
}