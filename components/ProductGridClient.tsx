'use client'

import { useState, useMemo } from 'react'
import { ProductSlider } from './ProductSlider'
import { ProductFilter, GenderFilter, SortOption } from './ProductFilter'

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
  created_at?: string | null
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
  
  // Check if product is unisex (in title or tags)
  const isUnisex = title.includes('unisex') || 
                   title.includes('(unisex)') ||
                   tags.some(tag => tag.includes('unisex'))
  
  if (filter === 'men') {
    // PRIORITY: If unisex, include it in men's filter
    if (isUnisex) {
      return true
    }
    
    // Check title first - if title clearly indicates men's, include it
    const hasMenInTitle = title.startsWith("mens") || 
                          title.startsWith("men's") ||
                          title.startsWith("men ")
    
    if (hasMenInTitle) {
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
    // PRIORITY: If unisex, include it in women's filter
    if (isUnisex) {
      return true
    }
    
    // Check title first - if title clearly indicates women's, include it
    const hasWomenInTitle = title.startsWith("womens") || 
                            title.startsWith("women's") ||
                            title.startsWith("women ")
    
    if (hasWomenInTitle) {
      return true
    }
    
    // If title doesn't clearly indicate women's, check if it's clearly a men's product
    const hasMenInTitle = title.startsWith("mens") || 
                          title.startsWith("men's") ||
                          title.startsWith("men ")
    
    if (hasMenInTitle) {
      return false // Title clearly indicates men's product - exclude (unless unisex, which we already checked)
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
  const [activeSort, setActiveSort] = useState<SortOption>('random')
  
  // Helper function to get minimum price from variants
  const getMinPrice = (product: Product): number => {
    if (!product.variants || product.variants.length === 0) return 0
    const availableVariants = product.variants.filter(v => v.is_available)
    if (availableVariants.length === 0) return 0
    return Math.min(...availableVariants.map(v => v.price))
  }
  
  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    // First filter by gender
    let filtered = products.filter(product => {
      const matches = matchesGenderFilter(product, activeFilter)
      if (activeFilter !== 'all') {
        console.log(`Product: "${product.title}" | Filter: ${activeFilter} | Matches: ${matches}`)
      }
      return matches
    })
    console.log(`Filter: ${activeFilter} | Total: ${products.length} | Filtered: ${filtered.length}`)
    
    // Then sort
    let sorted: Product[]
    if (activeSort === 'random') {
      // Shuffle array randomly
      sorted = [...filtered]
      for (let i = sorted.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sorted[i], sorted[j]] = [sorted[j], sorted[i]]
      }
    } else {
      sorted = [...filtered].sort((a, b) => {
        switch (activeSort) {
          case 'price-low': {
            const priceA = getMinPrice(a)
            const priceB = getMinPrice(b)
            return priceA - priceB
          }
          case 'price-high': {
            const priceA = getMinPrice(a)
            const priceB = getMinPrice(b)
            return priceB - priceA
          }
          case 'newest': {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
            return dateB - dateA // Newest first (descending)
          }
          case 'oldest': {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
            return dateA - dateB // Oldest first (ascending)
          }
          default:
            return 0
        }
      })
    }
    
    return sorted
  }, [products, activeFilter, activeSort])
  
  if (filteredAndSortedProducts.length === 0) {
    return (
      <>
        <ProductFilter 
          onFilterChange={setActiveFilter} 
          activeFilter={activeFilter}
          onSortChange={setActiveSort}
          activeSort={activeSort}
        />
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
      <ProductFilter 
        onFilterChange={setActiveFilter} 
        activeFilter={activeFilter}
        onSortChange={setActiveSort}
        activeSort={activeSort}
      />
      <ProductSlider products={filteredAndSortedProducts} />
    </>
  )
}
