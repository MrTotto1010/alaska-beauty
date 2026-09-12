import { api } from './api'
import type { Product } from '../types/product'
import type { Category } from '../types/category'

interface ProductsResponse {
  success: boolean
  productos: Product[]
}

interface CategoriesResponse {
  success: boolean
  categorias: Category[]
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${api.baseUrl}/catalogo/productos`)
  const data: ProductsResponse = await response.json()

  if (!response.ok || !data.success) {
    throw new Error('No se pudieron cargar los productos')
  }

  return data.productos
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${api.baseUrl}/catalogo/categorias`)
  const data: CategoriesResponse = await response.json()

  if (!response.ok || !data.success) {
    throw new Error('No se pudieron cargar las categorías')
  }

  return data.categorias
}