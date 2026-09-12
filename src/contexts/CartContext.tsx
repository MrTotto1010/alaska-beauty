import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '../types/product'

export interface CartItem {
  product: Product
  cantidad: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, cantidad: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(
  undefined
)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = (product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id
      )

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
              }
            : item
        )
      }

      return [
        ...currentItems,
        {
          product,
          cantidad: 1,
        },
      ]
    })
  }

  const removeFromCart = (productId: number) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.product.id !== productId
      )
    )
  }

  const updateQuantity = (
    productId: number,
    cantidad: number
  ) => {
    if (cantidad <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              cantidad,
            }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce(
    (total, item) => total + item.cantidad,
    0
  )

  const totalPrice = items.reduce(
    (total, item) =>
      total + item.product.precio * item.cantidad,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCart debe utilizarse dentro de CartProvider'
    )
  }

  return context
}