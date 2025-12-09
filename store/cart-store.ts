import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  product_id: string
  printify_product_id: string
  printify_variant_id: number
  product_title: string
  variant_title: string
  price: number // in cents
  quantity: number
  image_url?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  
  // Actions
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId: number) => void
  updateQuantity: (productId: string, variantId: number, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  
  // Computed
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const items = get().items
        const existingItemIndex = items.findIndex(
          (i) => i.product_id === item.product_id && i.printify_variant_id === item.printify_variant_id
        )

        if (existingItemIndex > -1) {
          // Item exists, increase quantity
          const newItems = [...items]
          newItems[existingItemIndex].quantity += item.quantity
          set({ items: newItems })
        } else {
          // New item, add to cart
          set({ items: [...items, item] })
        }
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product_id === productId && item.printify_variant_id === variantId)
          ),
        }))
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product_id === productId && item.printify_variant_id === variantId
              ? { ...item, quantity }
              : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      openCart: () => {
        set({ isOpen: true })
      },

      closeCart: () => {
        set({ isOpen: false })
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: 'caribbean-cart-storage',
    }
  )
)

