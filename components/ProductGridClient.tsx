'use client'

import { useState, useMemo } from 'react'
import { ProductSlider } from './ProductSlider'
import { ProductFilter, GenderFilter } from './ProductFilter'

interface ProductVariant {
  id: string
  printify_variant_id: number
  title: string
  price: number
  is_available: boolean
  image_url?: string
  option_ids?: number[]
}

interface Product {
  id: string
  printify_product_id: string
  title: string
  description: string | null
  main_image_url: string | null
  variants: ProductVariant[]
  tags?: string[]
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

interface ProductGridClientProps {
  products: Product[]
}

// Helper function to check if product matches gender filter
function matchesGenderFilter(product: Product, filter: GenderFilter): boolean {
  if (filter === 'all') return true
  
  const tags = (product.tags || []).map(tag => tag.toLowerCase())
  
  if (filter === 'men') {
    return tags.some(tag => 
      tag.includes('men') || 
      tag.includes('male') || 
      tag.includes('man') ||
      tag === 'mens'
    )
  }
  
  if (filter === 'women') {
    return tags.some(tag => 
      tag.includes('women') || 
      tag.includes('female') || 
      tag.includes('woman') ||
      tag === 'womens' ||
      tag === "women's"
    )
  }
  
  return true
}

export function ProductGridClient({ products }: ProductGridClientProps) {
  const [activeFilter, setActiveFilter] = useState<GenderFilter>('all')
  
  // Filter products based on selected gender
  const filteredProducts = useMemo(() => {
    return products.filter(product => matchesGenderFilter(product, activeFilter))
  }, [products, activeFilter])
  
  if (filteredProducts.length === 0) {
    return (
      <>
        <ProductFilter onFilterChange={setActiveFilter} activeFilter={activeFilter} />
        <div className="text-center py-12">
          <p className="text-gray-600">
            No {activeFilter !== 'all' ? `${activeFilter}'s` : ''} products found.
            {activeFilter !== 'all' && ' Try selecting "All Products".'}
          </p>
        </div>
      </>
    )
  }
  
  return (
    <>
      <ProductFilter onFilterChange={setActiveFilter} activeFilter={activeFilter} />
      <ProductSlider products={filteredProducts} />
    </>
  )
}
