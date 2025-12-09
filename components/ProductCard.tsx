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
      colorSet.add(color)
      sizeSet.add(size)
      map.set(`${color}|${size}`, variant)
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
      colors: Array.from(colorSet).sort(),
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
      {/* Product Image */}
      <div className="relative aspect-square bg-sand-100 overflow-hidden">
        {product.main_image_url ? (
          <Image
            src={product.main_image_url}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sand-400">
            No image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.title}
        </h3>

        {product.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Color Selection */}
        {colors.length > 1 && (
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Color: <span className="font-semibold text-gray-900">{selectedColor}</span>
            </label>
            <div className="flex flex-wrap gap-2">
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
                      px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all min-w-[80px]
                      ${
                        isSelected
                          ? 'border-ocean-600 bg-ocean-50 text-ocean-900 ring-2 ring-ocean-600 ring-offset-1'
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
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Size: <span className="font-semibold text-gray-900">{selectedSize}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isAvailable = availableSizesForColor.includes(size)
              const isSelected = selectedSize === size
              
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!isAvailable}
                  className={`
                    px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-all min-w-[60px]
                    ${
                      isSelected
                        ? 'border-coral-500 bg-coral-50 text-coral-900 ring-2 ring-coral-500 ring-offset-1'
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
          <p className="text-xs text-amber-600 mb-3 bg-amber-50 px-3 py-2 rounded-md">
            ⚠️ This combination is not available. Please select a different color or size.
          </p>
        )}

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-sand-200">
          <div>
            <span className="text-2xl font-bold text-ocean-700">
              {selectedVariant ? formatPrice(selectedVariant.price) : '—'}
            </span>
            {selectedVariant && (
              <p className="text-xs text-gray-500 mt-1">
                {selectedVariant.title}
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || isAdding}
            className={`
              px-5 py-3 rounded-lg font-semibold transition-all flex items-center gap-2
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
                <Check className="w-5 h-5" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
