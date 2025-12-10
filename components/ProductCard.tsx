'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/utils'

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
}

interface ProductCardProps {
  product: Product
}

// Parse variant title like "White / XL" or "Bay / L" into color and size
function parseVariantTitle(title: string): { color: string; size: string } {
  const parts = title.split('/').map(p => p.trim())
  return {
    color: parts[0] || '',
    size: parts[1] || parts[0] || '' // If no second part, use first part as size
  }
}

// Colors to exclude from all products
const EXCLUDED_COLORS = ['Blue Jean', 'Chili', 'Ice Blue', 'Ivory', 'Pepper', 'Watermelon', 'Khaki', 'Berry']

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()
  
  // Extract unique colors and sizes
  const { colors, sizes, variantMap } = useMemo(() => {
    const colorSet = new Set<string>()
    const sizeSet = new Set<string>()
    const map = new Map<string, ProductVariant>()
    
    product.variants.forEach(variant => {
      if (!variant.is_available) return
      
      const { color, size } = parseVariantTitle(variant.title)
      
      // Skip excluded colors
      if (EXCLUDED_COLORS.includes(color)) return
      
      colorSet.add(color)
      sizeSet.add(size)
      map.set(`${color}|${size}`, variant)
    })
    
    // Sort colors with White first, then alphabetically
    const sortedColors = Array.from(colorSet).sort((a, b) => {
      if (a === 'White') return -1
      if (b === 'White') return 1
      return a.localeCompare(b)
    })
    
    // Sort sizes by common order
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
    const sortedSizes = Array.from(sizeSet).sort((a, b) => {
      const aIndex = sizeOrder.indexOf(a)
      const bIndex = sizeOrder.indexOf(b)
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
    
    return {
      colors: sortedColors,
      sizes: sortedSizes,
      variantMap: map
    }
  }, [product.variants])
  
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || '')
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || '')
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Get the selected variant
  const selectedVariant = variantMap.get(`${selectedColor}|${selectedSize}`)
  
  // Get the display image - use variant image if available, otherwise main product image
  const displayImage = selectedVariant?.image_url || product.main_image_url
  
  // Check which sizes are available for current color
  const availableSizesForColor = useMemo(() => {
    return sizes.filter(size => variantMap.has(`${selectedColor}|${size}`))
  }, [selectedColor, sizes, variantMap])
  
  // Check which colors are available for current size
  const availableColorsForSize = useMemo(() => {
    return colors.filter(color => variantMap.has(`${color}|${selectedSize}`))
  }, [selectedSize, colors, variantMap])

  const handleAddToCart = () => {
    if (!selectedVariant) return

    setIsAdding(true)

    addItem({
      product_id: product.id,
      printify_product_id: product.printify_product_id,
      printify_variant_id: selectedVariant.printify_variant_id,
      product_title: product.title,
      variant_title: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      image_url: product.main_image_url || undefined,
    })

    // Show success animation
    setShowSuccess(true)
    setTimeout(() => {
      setIsAdding(false)
      setShowSuccess(false)
      openCart()
    }, 500)
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      {/* Product Image - Smaller and more compact */}
      <div className="relative aspect-[4/3] bg-sand-100 overflow-hidden">
        {displayImage ? (
          <Image
            key={displayImage} // Force re-render on image change
            src={displayImage}
            alt={`${product.title} - ${selectedColor}`}
            fill
            className="object-cover group-hover:scale-105 transition-all duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sand-400">
            No image
          </div>
        )}
        
        {/* Color indicator overlay */}
        {selectedColor && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-md">
            <span className="text-xs font-semibold text-gray-800">{selectedColor}</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3 line-clamp-2">
          {product.title}
        </h3>

        {/* Color Selection */}
        {colors.length > 1 && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Color: <span className="font-semibold text-gray-900">{selectedColor}</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {colors.map((color) => {
                const isAvailable = availableColorsForSize.includes(color)
                const isSelected = selectedColor === color
                
                return (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color)
                      // Auto-select first available size for new color
                      const availableSizes = sizes.filter(s => variantMap.has(`${color}|${s}`))
                      if (!availableSizes.includes(selectedSize) && availableSizes.length > 0) {
                        setSelectedSize(availableSizes[0])
                      }
                    }}
                    disabled={!isAvailable}
                    className={`
                      px-2 py-1.5 text-xs font-medium rounded-lg border-2 transition-all min-w-[70px]
                      ${
                        isSelected
                          ? 'border-ocean-600 bg-ocean-50 text-ocean-900 ring-1 ring-ocean-600'
                          : isAvailable
                          ? 'border-sand-200 bg-white text-gray-700 hover:border-ocean-400 hover:bg-sand-50'
                          : 'border-sand-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                      }
                    `}
                    title={isAvailable ? color : `${color} (unavailable in size ${selectedSize})`}
                  >
                    {color}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Size Selection */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Size: <span className="font-semibold text-gray-900">{selectedSize}</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {sizes.map((size) => {
              const isAvailable = availableSizesForColor.includes(size)
              const isSelected = selectedSize === size
              
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!isAvailable}
                  className={`
                    px-2 py-1.5 text-xs font-semibold rounded-lg border-2 transition-all min-w-[50px]
                    ${
                      isSelected
                        ? 'border-coral-500 bg-coral-50 text-coral-900 ring-1 ring-coral-500'
                        : isAvailable
                        ? 'border-sand-200 bg-white text-gray-700 hover:border-coral-400 hover:bg-coral-50'
                        : 'border-sand-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50 line-through'
                    }
                  `}
                  title={isAvailable ? `Size ${size}` : `Size ${size} (unavailable in ${selectedColor})`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>

        {/* Availability Notice */}
        {!selectedVariant && (
          <p className="text-xs text-amber-600 mb-2 bg-amber-50 px-2 py-1.5 rounded-md">
            ⚠️ This combination is not available. Please select a different color or size.
          </p>
        )}

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-sand-200">
          <div>
            <span className="text-xl font-bold text-ocean-700">
              {selectedVariant ? formatPrice(selectedVariant.price) : '—'}
            </span>
            {selectedVariant && (
              <p className="text-xs text-gray-500 mt-0.5">
                {selectedVariant.title}
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || isAdding}
            className={`
              px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 text-sm
              ${
                showSuccess
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-coral-500 to-coral-600 text-white hover:from-coral-600 hover:to-coral-700 shadow-md hover:shadow-lg'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {showSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
