'use client'

import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { WeatherIcon } from './WeatherIcon'

export function Header() {
  const { getTotalItems, openCart } = useCartStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const cartCount = isClient ? getTotalItems() : 0

  return (
    <header 
      className="bg-gradient-to-br from-ocean-400/70 via-ocean-500/70 to-ocean-600/70 backdrop-blur-md shadow-lg sticky top-0 z-40"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Main H1 for SEO */}
          <Link 
            href="/" 
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            aria-label="Costambar Tees home page"
          >
            <Image 
              src="/CT-Logo-white.png" 
              alt="Costambar Tees Logo" 
              width={629} 
              height={451}
              className="h-8 w-auto"
              unoptimized
              priority
            />
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Costambar Tees
          </h1>
          </Link>

          {/* Right side: Weather and Cart */}
          <nav className="flex items-center gap-3" aria-label="Shopping cart and weather">
            {/* Weather Icon */}
            <WeatherIcon />

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-white hover:text-ocean-100 transition-colors"
              aria-label={`Shopping cart with ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
            >
              <ShoppingCart className="w-6 h-6" aria-hidden="true" />
              {cartCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-coral-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  aria-label={`${cartCount} items in cart`}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

