import { supabase } from '@/lib/supabase'
import { ProductCard } from './ProductCard'

export async function ProductGrid() {
  // Fetch products with their variants from Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      variants:product_variants(*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load products. Please try again later.</p>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          No products available yet
        </h2>
        <p className="text-gray-500">
          Run <code className="bg-sand-200 px-2 py-1 rounded">npm run sync-products</code> to sync from Printify
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

