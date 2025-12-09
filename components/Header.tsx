'use client'

import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'

export function Header() {
  const { getTotalItems, openCart } = useCartStore()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-ocean-600 to-coral-500 bg-clip-text text-transparent">
            🌴 Costambar Tees
          </h1>
          </div>

          {/* Cart Button */}
          <button
            onClick={openCart}
            className="relative p-2 text-gray-700 hover:text-ocean-600 transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-coral-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

