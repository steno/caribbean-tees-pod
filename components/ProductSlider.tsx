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
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }
  
  const goToNext = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }
  
  // Check if there are more products in each direction
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < totalPages - 1
  
  // Always show slider structure, even with 2 products
  return (
    <div className="relative">
      {/* Navigation Arrows - Show only when there are more products in that direction */}
      {totalPages > 1 && (
        <>
          {hasPrevious && (
            <button
              onClick={goToPrevious}
              className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 border-2 border-ocean-200 hover:border-ocean-400"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5 text-ocean-600" />
            </button>
          )}
          
          {hasNext && (
            <button
              onClick={goToNext}
              className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 border-2 border-ocean-200 hover:border-ocean-400"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5 text-ocean-600" />
            </button>
          )}
        </>
      )}
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 transition-opacity duration-300">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {/* Placeholder when only 1 product on page */}
        {currentProducts.length === 1 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden opacity-60">
            {/* Placeholder Image */}
            <div className="relative aspect-[4/3] bg-gray-300 overflow-hidden flex items-center justify-center">
              <div className="text-center px-4">
                <p className="text-gray-600 text-sm font-medium">More Coming Soon</p>
              </div>
            </div>
            {/* Placeholder Content */}
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        )}
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

