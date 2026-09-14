
export interface ProductImage {
  id: number
  url: string
  orden: number
}

export interface Product {
  id: number
  nombre: string
  marca: string | null
  descripcion: string | null
  precio: number
  disponibilidad: number
  id_categoria: number
  categoria: string
  descripcion_categoria: string | null
  imagenes: ProductImage[]
}