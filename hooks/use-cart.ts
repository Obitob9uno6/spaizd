"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: string
  productId: string
  variantId: string
  name: string
  price: number
  quantity: number
  image: string
  size?: string
  color?: string
}

interface CartStore {
  items: CartItem[]
  itemCount: number
  total: number
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      total: 0,

      addItem: (item) => {
        const items = get().items
        const existingItem = items.find((i) => i.id === item.id)

        if (existingItem) {
          set({
            items: items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
          })
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }],
          })
        }

        // Update computed values
        const newItems = get().items
        set({
          itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
          total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        })
      },

      removeItem: (id) => {
        const items = get().items.filter((item) => item.id !== id)
        set({
          items,
          itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
          total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        const items = get().items.map((item) => (item.id === id ? { ...item, quantity } : item))

        set({
          items,
          itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
          total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        })
      },

      clearCart: () => {
        set({
          items: [],
          itemCount: 0,
          total: 0,
        })
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
