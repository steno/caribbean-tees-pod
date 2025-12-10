'use client'

import { ProductGrid } from '@/components/ProductGrid'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export default function HomePage() {
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  return (
    <div className="min-h-screen">
      {/* Hero Section - Beach Theme */}
      <section className="relative overflow-hidden min-h-[500px]">
        {/* Background GIF - Just the image, no overlay text */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/home-bg.gif')",
          }}
        />

        {/* Gradient overlay at bottom for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-gradient-to-r from-ocean-600 via-ocean-500 to-coral-500 bg-clip-text mb-4">
            Costambar Tees
          </h1>
          
          {/* Expandable About Section for SEO */}
          <div className="max-w-3xl mx-auto mb-8">
            <button
              onClick={() => setIsAboutOpen(!isAboutOpen)}
              className="inline-flex items-center gap-2 text-ocean-600 hover:text-ocean-700 font-medium transition-colors"
              aria-expanded={isAboutOpen}
            >
              <span>About Our Tees</span>
              {isAboutOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            
            {isAboutOpen && (
              <div className="mt-4 text-gray-700 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-xl">
                  Bring the island vibes to your wardrobe
                </p>
                <p className="text-base">
                  Each design is carefully crafted and printed fresh when you order. 
                  Premium quality tees with beach and Costambar themes, printed on-demand 
                  and shipped worldwide. Choose your favorite size and we&apos;ll handle the rest!
                </p>
              </div>
            )}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Shop Our Collection
          </h2>
        </div>

        <ProductGrid />
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-sand-100 to-coral-50 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-ocean-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Unique Designs
              </h3>
              <p className="text-gray-600">
                Original Costambar-inspired artwork you won&apos;t find anywhere else
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👕</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Premium Quality
              </h3>
              <p className="text-gray-600">
                Soft, comfortable fabrics that feel as good as island breeze
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-palm-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Worldwide Shipping
              </h3>
              <p className="text-gray-600">
                Printed locally and shipped directly to your door
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

