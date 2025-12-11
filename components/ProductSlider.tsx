'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from './ProductCard'

interface ProductVariant {
  id: string
  printify_variant_id: number
  title: string
  price: number
  is_available: boolean
  image_url?: string
}

interface Product {
  id: string
  printify_product_id: string
  title: string
  description: string | null
  main_image_url: string | null
  variants: ProductVariant[]
  tags?: string[] // Tags from Printify for filtering
  options?: Array<{
    name: string
    type: string
    values: Array<{
      id: number
      title: string
      colors?: string[]
    }>
  }>
}

interface ProductSliderProps {
  products: Product[]
}

export function ProductSlider({ products }: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Show 2 products at a time
  const itemsPerPage = 2
  const totalPages = Math.ceil(products.length / itemsPerPage)
  
  // Get current products to display
  const currentProducts = products.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  )
  
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1))
  }
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1))
  }
  
  // Always show slider structure, even with 2 products
  return (
    <div className="relative">
      {/* Navigation Arrows - Show when more than 1 page */}
      {totalPages > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 border-2 border-ocean-200 hover:border-ocean-400"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-5 h-5 text-ocean-600" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 border-2 border-ocean-200 hover:border-ocean-400"
            aria-label="Next products"
          >
            <ChevronRight className="w-5 h-5 text-ocean-600" />
          </button>
        </>
      )}
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 transition-opacity duration-300">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Page Indicators - Show when more than 1 page */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-ocean-600'
                  : 'w-2 bg-sand-300 hover:bg-sand-400'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

