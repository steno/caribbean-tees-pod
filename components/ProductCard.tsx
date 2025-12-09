'use client'

import { useState } from 'react'
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

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants[0] || null
  )
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

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
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>

        {product.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Variant Selection */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Select Size
          </label>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                disabled={!variant.is_available}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md transition-all
                  ${
                    selectedVariant?.id === variant.id
                      ? 'bg-ocean-600 text-white ring-2 ring-ocean-600 ring-offset-2'
                      : variant.is_available
                      ? 'bg-sand-100 text-gray-700 hover:bg-sand-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {variant.title}
              </button>
            ))}
          </div>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-ocean-700">
            {selectedVariant ? formatPrice(selectedVariant.price) : '—'}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || isAdding}
            className={`
              px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2
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

