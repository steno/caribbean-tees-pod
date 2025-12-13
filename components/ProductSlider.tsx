'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [itemsPerPage, setItemsPerPage] = useState(2)
  const sliderRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  
  // Responsive items per page: 1 on mobile, 2 on desktop
  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth < 1024 ? 1 : 2)
    }
    
    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [])
  
  const totalPages = Math.ceil(products.length / itemsPerPage)
  
  // Get current products to display
  const currentProducts = products.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  )
  
  // Reset to first page when itemsPerPage changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [itemsPerPage])
  
  // Reset to first page when products list changes (filter or sort change)
  // This ensures correct sorting when filters/sort options change
  useEffect(() => {
    setCurrentIndex(0)
  }, [products])
  
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
  
  // Swipe gesture handlers for mobile
  const minSwipeDistance = 50
  
  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null
    touchStartX.current = e.targetTouches[0].clientX
  }
  
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }
  
  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const distance = touchStartX.current - touchEndX.current
    
    if (distance > minSwipeDistance && hasNext) {
      goToNext()
    }
    if (distance < -minSwipeDistance && hasPrevious) {
      goToPrevious()
    }
  }
  
  // Always show slider structure, even with 2 products
  return (
    <div 
      className="relative"
      ref={sliderRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Minimal Edge Navigation - Desktop only, subtle design */}
      {totalPages > 1 && (
        <>
          {/* Left edge - simple chevron without circle */}
          {hasPrevious && (
            <>
              {/* Desktop: Simple chevron icon */}
              <button
                onClick={goToPrevious}
                className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center hover:opacity-70 transition-opacity"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-16 h-16 stroke-[4]" style={{ color: '#217ba1' }} />
              </button>
              {/* Mobile: Simple chevron icon */}
              <button
                onClick={goToPrevious}
                className="lg:hidden flex absolute left-2 top-1/4 -translate-y-1/2 z-10 items-center justify-center active:opacity-70 transition-opacity"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-12 h-12 stroke-[3]" style={{ color: '#217ba1' }} />
              </button>
            </>
          )}
          
          {/* Right edge - simple chevron without circle */}
          {hasNext && (
            <>
              {/* Desktop: Simple chevron icon */}
              <button
                onClick={goToNext}
                className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center hover:opacity-70 transition-opacity"
                aria-label="Next products"
              >
                <ChevronRight className="w-16 h-16 stroke-[4]" style={{ color: '#217ba1' }} />
              </button>
              {/* Mobile: Simple chevron icon */}
              <button
                onClick={goToNext}
                className="lg:hidden flex absolute right-2 top-1/4 -translate-y-1/2 z-10 items-center justify-center active:opacity-70 transition-opacity"
                aria-label="Next products"
              >
                <ChevronRight className="w-12 h-12 stroke-[3]" style={{ color: '#217ba1' }} />
              </button>
            </>
          )}
        </>
      )}
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 transition-opacity duration-300">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {/* Placeholder when only 1 product on page (desktop only) */}
        {currentProducts.length === 1 && itemsPerPage === 2 && (
          <div className="hidden lg:block bg-white rounded-xl shadow-md overflow-hidden opacity-60">
            {/* Placeholder Image */}
            <div 
              className="relative aspect-[4/3] overflow-hidden bg-cover bg-center bg-no-repeat flex items-center justify-center"
              style={{
                backgroundImage: "url('/tshirt-holder.png')",
              }}
            >
              <p className="text-gray-800 text-lg font-semibold text-center px-4 drop-shadow-lg">
                More tees coming soon
              </p>
            </div>
            {/* Placeholder Content */}
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Page Indicators - Enhanced for mobile */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 mb-4">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 h-2.5 bg-ocean-600 shadow-md'
                  : 'w-2.5 h-2.5 bg-sand-300 hover:bg-ocean-400 active:bg-ocean-500'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

