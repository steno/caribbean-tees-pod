'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ShoppingCart, Check, Info, Loader2 } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/utils'

interface ProductVariant {
  id: string
  printify_variant_id: number
  title: string
  price: number
  is_available: boolean
  image_url?: string
  option_ids?: number[] // Option IDs from Printify
}

interface PrintifyOption {
  name: string
  type: string
  values: Array<{
    id: number
    title: string
    colors?: string[]
  }>
}

interface Product {
  id: string
  printify_product_id: string
  title: string
  description: string | null
  main_image_url: string | null
  variants: ProductVariant[]
  options?: PrintifyOption[] // Options from Printify
  tags?: string[] // Tags from Printify for filtering
}

interface ProductCardProps {
  product: Product
}

// Color mapping for common t-shirt colors
const getColorHex = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'white': '#FFFFFF',
    'black': '#000000',
    'navy': '#001F3F',
    'heather navy': '#2C3E50',
    'heather grey': '#B8B8B8',
    'sport grey': '#A0A0A0',
    'ash': '#E8E8E8',
    'charcoal': '#36454F',
    'olive': '#556B2F',
    'forest': '#228B22',
    'army green': '#4B5320',
    'royal': '#4169E1',
    'blue': '#0066CC',
    'blue spruce': '#2E5266',
    'carolina blue': '#4B9CD3',
    'light blue': '#ADD8E6',
    'red': '#DC143C',
    'maroon': '#800000',
    'burgundy': '#800020',
    'pink': '#FFC0CB',
    'heather pink': '#FFB6C1',
    'purple': '#800080',
    'grape': '#6F2DA8',
    'lavender': '#E6E6FA',
    'yellow': '#FFD700',
    'gold': '#FFD700',
    'orange': '#FF8C00',
    'coral': '#FF7F50',
    'crunchberry': '#8B008B',
    'brown': '#8B4513',
    'tan': '#D2B48C',
    'sand': '#F4A460',
    'cream': '#FFFDD0',
    'ivory': '#FFFFF0',
    'natural': '#FAEBD7',
  }
  
  const normalized = colorName.toLowerCase().trim()
  return colorMap[normalized] || colorMap[normalized.replace(/\s+/g, ' ')] || '#CCCCCC' // Default grey if not found
}

// Helper function to check if product is women's
function isWomensProduct(product: Product): boolean {
  const title = (product.title || '').toLowerCase().trim()
  const tags = (product.tags || []).map(tag => tag.toLowerCase())
  
  // First, check if it's clearly a men's product - if so, it's NOT women's
  // This includes "Men's (Unisex)" products
  const hasMenInTitle = title.startsWith("mens") || 
                        title.startsWith("men's") ||
                        title.startsWith("men ") ||
                        (title.includes("(unisex)") && !title.includes("women"))
  
  if (hasMenInTitle) {
    return false
  }
  
  // Check tags first - if it has men's tags and no women's tags, it's NOT women's
  const hasMenTag = tags.some(tag => {
    const lowerTag = tag.toLowerCase()
    return lowerTag.startsWith('men') || 
           lowerTag.startsWith('male') || 
           lowerTag.startsWith('man') ||
           lowerTag === 'mens' ||
           lowerTag === "men's"
  })
  
  const hasWomenTag = tags.some(tag => {
    const lowerTag = tag.toLowerCase()
    return lowerTag.includes('women') || 
           lowerTag.includes('female') || 
           lowerTag.includes('woman') ||
           lowerTag === 'womens' ||
           lowerTag === "women's" ||
           lowerTag.includes('softstyle')
  })
  
  // If it has men's tags but no women's tags, it's NOT women's
  if (hasMenTag && !hasWomenTag) {
    return false
  }
  
  // Only return true if title clearly indicates women's
  const hasWomenInTitle = title.startsWith("womens") || 
                          title.startsWith("women's") ||
                          title.startsWith("women ") ||
                          title.includes(" women's ") ||
                          title.includes("(women's)")
  
  // Also check for "softstyle" which is typically women's
  const hasSoftstyle = title.includes("softstyle")
  
  // Return true only if title clearly indicates women's OR has women's tags (and no men's tags)
  return (hasWomenInTitle || hasSoftstyle) || (hasWomenTag && !hasMenTag)
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()
  const isWomens = isWomensProduct(product)
  
  // Extract unique colors and sizes using Printify options
  const { colors, sizes, variantMap, colorHexMap } = useMemo(() => {
    const colorSet = new Set<string>()
    const sizeSet = new Set<string>()
    const map = new Map<string, ProductVariant>()
    const hexMap = new Map<string, string>() // Map color name to hex
    
    // If we have options from Printify, use them
    if (product.options && product.options.length > 0) {
      // Find color and size options
      const colorOption = product.options.find(opt => 
        opt.name.toLowerCase().includes('color') || 
        opt.name.toLowerCase().includes('colour')
      )
      const sizeOption = product.options.find(opt => 
        opt.name.toLowerCase().includes('size')
      )
      
      // Create maps from option ID to value title and color hex
      const colorIdMap = new Map<number, string>()
      const colorHexMap = new Map<number, string>()
      const sizeIdMap = new Map<number, string>()
      
      if (colorOption) {
        colorOption.values.forEach(val => {
          colorIdMap.set(val.id, val.title)
          // Use Printify's color hex if available, otherwise use our mapping
          const hex = val.colors && val.colors.length > 0 
            ? val.colors[0] 
            : getColorHex(val.title)
          colorHexMap.set(val.id, hex)
        })
      }
      
      if (sizeOption) {
        sizeOption.values.forEach(val => {
          sizeIdMap.set(val.id, val.title)
        })
      }
      
      // Extract colors and sizes from variants using option IDs
      product.variants.forEach(variant => {
        if (!variant.is_available || !variant.option_ids) return
        
        let color = ''
        let size = ''
        
        // Map option IDs to color and size
        variant.option_ids.forEach(optionId => {
          if (colorIdMap.has(optionId)) {
            color = colorIdMap.get(optionId)!
          }
          if (sizeIdMap.has(optionId)) {
            size = sizeIdMap.get(optionId)!
          }
        })
        
        if (color && size) {
          colorSet.add(color)
          sizeSet.add(size)
          map.set(`${color}|${size}`, variant)
          // Store hex code for this color
          if (!hexMap.has(color)) {
            // Try to get hex from colorOption values
            if (colorOption) {
              const colorValue = colorOption.values.find(v => v.title === color)
              if (colorValue) {
                const hex = colorValue.colors && colorValue.colors.length > 0 
                  ? colorValue.colors[0] 
                  : getColorHex(color)
                hexMap.set(color, hex)
              } else {
                hexMap.set(color, getColorHex(color))
              }
            } else {
              hexMap.set(color, getColorHex(color))
            }
          }
        }
      })
    } else {
      // Fallback to parsing title if options not available
      product.variants.forEach(variant => {
        if (!variant.is_available) return
        
        const parts = variant.title.split('/').map(p => p.trim())
        const color = parts[0] || ''
        const size = parts[1] || parts[0] || ''
        
        if (color && size) {
          colorSet.add(color)
          sizeSet.add(size)
          map.set(`${color}|${size}`, variant)
          // Store hex code for this color (fallback parsing)
          if (!hexMap.has(color)) {
            hexMap.set(color, getColorHex(color))
          }
        }
      })
    }
    
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
      variantMap: map,
      colorHexMap: hexMap
    }
  }, [product.variants, product.options])
  
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || '')
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || '')
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const hasInitializedColor = useRef(false)
  
  // Set initial color after component mounts (client-side only) to avoid hydration errors
  // Prefer White, otherwise use first available color
  useEffect(() => {
    if (colors.length === 0 || hasInitializedColor.current) return
    
    const initialColor = colors.find(color => color.toLowerCase() === 'white') || colors[0]
    if (initialColor) {
      setSelectedColor(initialColor)
      hasInitializedColor.current = true
      // Make sure the selected size is available for this color
      const availableSizes = sizes.filter(s => variantMap.has(`${initialColor}|${s}`))
      if (availableSizes.length > 0 && !availableSizes.includes(selectedSize)) {
        setSelectedSize(availableSizes[0])
      }
    }
  }, [colors, selectedSize, sizes, variantMap])
  
  // Get the selected variant
  const selectedVariant = variantMap.get(`${selectedColor}|${selectedSize}`)
  
  // Get the display image - use variant image if available, otherwise main product image
  const displayImage = selectedVariant?.image_url || product.main_image_url
  
  // Reset loading state when image changes
  useEffect(() => {
    setImageLoading(true)
  }, [displayImage])
  
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
      image_url: selectedVariant.image_url || product.main_image_url || undefined,
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Product Image - Smaller and more compact */}
      <div className="relative aspect-[4/3] bg-sand-100 overflow-hidden group">
        {displayImage ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 text-ocean-600 animate-spin" />
              </div>
            )}
            <Image
              key={displayImage} // Force re-render on image change
              src={displayImage}
              alt={`${product.title} - ${selectedColor}`}
              fill
              className={`object-cover scale-100 group-hover:scale-[1.5] transition-all duration-500 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
              onLoad={() => setImageLoading(false)}
              onLoadStart={() => setImageLoading(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sand-400">
            No image
          </div>
        )}
        
        {/* Info Icon - Top Left */}
        <div className="absolute top-2 left-2 z-10">
          <button
            onClick={() => setShowInfo(!showInfo)}
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all"
            aria-label="Product information"
          >
            <Info className="w-4 h-4 text-ocean-600" />
          </button>
          
          {/* Info Popover */}
          {showInfo && (
            <div 
              className="absolute top-12 left-0 w-[calc(100vw-2rem)] sm:w-72 max-w-sm bg-white rounded-lg shadow-xl border border-sand-200 p-2.5 sm:p-3 z-20"
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
            >
              <div className="space-y-2 sm:space-y-3 text-[10px] sm:text-xs">
                {/* Product Features */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 sm:mb-1.5 text-[9px] sm:text-[10px] uppercase tracking-wide">
                    Product Features
                  </h4>
                  <ul className="space-y-0.5 sm:space-y-1 text-gray-700 leading-tight">
                    {isWomens ? (
                      <>
                        <li className="flex items-start">
                          <span className="text-ocean-600 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>100% ringspun cotton (solids), lightweight 4.5 oz</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-ocean-600 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>Ribbed knit collar with seam</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-ocean-600 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>Twill shoulder tape and side seams</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-ocean-600 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>Double-needle sleeve and bottom hem</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-ocean-600 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>Semi-fitted cut, true to size</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start">
                          <span className="text-ocean-600 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>Sizes S–4XL, Comfort Colors 1717 sizing</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-ocean-600 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>100% ring-spun US cotton, pre-shrunk (6.1 oz/yd²)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-ocean-600 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>Garment-dyed for soft, lived-in texture</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-ocean-600 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>Tubular knit, double-needle stitched</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-ocean-600 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>Relaxed fit, made in Honduras</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
                
                {/* Divider */}
                <div className="border-t border-sand-200"></div>
                
                {/* Care Instructions */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 sm:mb-1.5 text-[9px] sm:text-[10px] uppercase tracking-wide">
                    Care Instructions
                  </h4>
                  <ul className="space-y-0.5 sm:space-y-1 text-gray-700 leading-tight">
                    {isWomens ? (
                      <>
                        <li className="flex items-start">
                          <span className="text-coral-500 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>Machine wash cold (max 30°C/90°F)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-coral-500 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>Non-chlorine bleach as needed</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-coral-500 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>Tumble dry medium</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-coral-500 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>Do not iron</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-coral-500 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>Do not dryclean</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start">
                          <span className="text-coral-500 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>Machine wash cold (max 30°C/90°F)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-coral-500 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>Do not bleach</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-coral-500 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>Tumble dry low heat</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-coral-500 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>Iron/steam low heat</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-coral-500 mr-1 sm:mr-1.5 flex-shrink-0">•</span>
                          <span>Do not dryclean</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          {product.title}
        </h3>

        {/* Color Selection */}
        {colors.length > 0 && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color: <span className="font-semibold text-gray-900">{selectedColor}</span>
            </label>
            <div className="flex flex-wrap gap-3 justify-center">
              {colors.map((color) => {
                const isAvailable = availableColorsForSize.includes(color)
                const isSelected = selectedColor === color
                const colorHex = colorHexMap.get(color) || getColorHex(color)
                
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
                      w-10 h-10 rounded-full border-2 transition-all relative
                      ${isSelected 
                        ? 'border-ocean-600 ring-2 ring-ocean-600 ring-offset-2 scale-110' 
                        : isAvailable
                        ? 'border-gray-300 hover:border-ocean-400 hover:scale-105'
                        : 'border-gray-200 opacity-40 cursor-not-allowed'
                      }
                    `}
                    style={{
                      backgroundColor: colorHex,
                      boxShadow: isSelected ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : 'none'
                    }}
                    title={isAvailable ? color : `${color} (unavailable in size ${selectedSize})`}
                    aria-label={`Select color ${color}`}
                  >
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
          <div className="flex flex-wrap gap-1.5 justify-center">
            {sizes.map((size) => {
              const isAvailable = availableSizesForColor.includes(size)
              const isSelected = selectedSize === size
              
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!isAvailable}
                  className={`
                    px-2.5 py-1.5 text-xs font-semibold rounded-lg border-2 transition-all min-w-[50px]
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
              px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 text-sm
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
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
