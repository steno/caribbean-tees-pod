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
  
  // Check tags and title
  const tags = (product.tags || []).map(tag => tag.toLowerCase())
  const title = (product.title || '').toLowerCase().trim()
  
  if (filter === 'men') {
    // PRIORITY: Check title first - if title clearly indicates men's, include it regardless of tags
    const hasMenInTitle = title.startsWith("mens") || 
                          title.startsWith("men's") ||
                          title.startsWith("men ")
    
    if (hasMenInTitle) {
      // Title clearly indicates men's product - include it even if it has women's tags (unisex)
      return true
    }
    
    // If title doesn't clearly indicate men's, check if it's clearly a women's product
    const hasWomenInTitle = title.startsWith("womens") || 
                            title.startsWith("women's") ||
                            title.startsWith("women ")
    
    if (hasWomenInTitle) {
      return false // Title clearly indicates women's product - exclude
    }
    
    // Title is ambiguous - check tags
    const hasMenTag = tags.some(tag => {
      const lowerTag = tag.toLowerCase()
      return lowerTag.startsWith('men') || 
             lowerTag.startsWith('male') || 
             lowerTag.startsWith('man') ||
             lowerTag === 'mens' ||
             lowerTag === "men's"
    })
    
    // Only exclude if it has women's tags AND no men's tags
    const hasWomenTag = tags.some(tag => {
      const lowerTag = tag.toLowerCase()
      return lowerTag.startsWith('women') || 
             lowerTag.startsWith('female') || 
             lowerTag.startsWith('woman') ||
             lowerTag === 'womens' ||
             lowerTag === "women's"
    })
    
    // If it has men's tags, include it (even if it also has women's tags - unisex)
    if (hasMenTag) {
      return true
    }
    
    // If it only has women's tags (no men's tags), exclude it
    if (hasWomenTag) {
      return false
    }
    
    // No clear gender indicators - don't include in men's filter
    return false
  }
  
  if (filter === 'women') {
    // PRIORITY: Check title first - if title clearly indicates women's, include it regardless of tags
    const hasWomenInTitle = title.startsWith("womens") || 
                            title.startsWith("women's") ||
                            title.startsWith("women ")
    
    if (hasWomenInTitle) {
      // Title clearly indicates women's product - include it even if it has men's tags (unisex)
      return true
    }
    
    // If title doesn't clearly indicate women's, check if it's clearly a men's product
    const hasMenInTitle = title.startsWith("mens") || 
                          title.startsWith("men's") ||
                          title.startsWith("men ")
    
    if (hasMenInTitle) {
      return false // Title clearly indicates men's product - exclude
    }
    
    // Title is ambiguous - check tags
    const hasWomenTag = tags.some(tag => {
      const lowerTag = tag.toLowerCase()
      return lowerTag.startsWith('women') || 
             lowerTag.startsWith('female') || 
             lowerTag.startsWith('woman') ||
             lowerTag === 'womens' ||
             lowerTag === "women's"
    })
    
    // Only exclude if it has men's tags AND no women's tags
    const hasMenTag = tags.some(tag => {
      const lowerTag = tag.toLowerCase()
      return lowerTag.startsWith('men') || 
             lowerTag.startsWith('male') || 
             lowerTag.startsWith('man') ||
             lowerTag === 'mens' ||
             lowerTag === "men's"
    })
    
    // If it has women's tags, include it (even if it also has men's tags - unisex)
    if (hasWomenTag) {
      return true
    }
    
    // If it only has men's tags (no women's tags), exclude it
    if (hasMenTag) {
      return false
    }
    
    // No clear gender indicators - don't include in women's filter
    return false
  }
  
  return true
}

export function ProductGridClient({ products }: ProductGridClientProps) {
  const [activeFilter, setActiveFilter] = useState<GenderFilter>('all')
  
  // Filter products based on selected gender
  const filteredProducts = useMemo(() => {
    const filtered = products.filter(product => {
      const matches = matchesGenderFilter(product, activeFilter)
      if (activeFilter !== 'all') {
        console.log(`Product: "${product.title}" | Filter: ${activeFilter} | Matches: ${matches}`)
      }
      return matches
    })
    console.log(`Filter: ${activeFilter} | Total: ${products.length} | Filtered: ${filtered.length}`)
    return filtered
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
