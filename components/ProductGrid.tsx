import { getAdminDb } from '@/lib/firebase-admin'
import { ProductGridClient } from './ProductGridClient'

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
  tags?: string[] // Tags from Printify for filtering
  visible?: boolean // Visibility status from Printify
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

export async function ProductGrid() {
  try {
    // Fetch products from Firestore (always fetch fresh data)
    const db = getAdminDb()
    const productsSnapshot = await db.collection('products').get()
    
    const products: Product[] = []

    // Fetch each product with its variants
    for (const doc of productsSnapshot.docs) {
      const productData = doc.data()
      
      // Fetch variants subcollection
      const variantsSnapshot = await db
        .collection('products')
        .doc(doc.id)
        .collection('variants')
        .get()

      const variants: ProductVariant[] = variantsSnapshot.docs.map(variantDoc => ({
        id: variantDoc.id,
        ...variantDoc.data(),
      } as ProductVariant))

      // Only include visible products (default to true for backwards compatibility)
      const isVisible = productData.visible !== false
      
      if (isVisible) {
        products.push({
          id: doc.id,
          printify_product_id: productData.printify_product_id,
          title: productData.title,
          description: productData.description || null,
          main_image_url: productData.main_image_url || null,
          variants: variants,
          tags: productData.tags || [],
          visible: productData.visible !== false,
          options: productData.options || undefined,
        })
      }
    }

    if (products.length === 0) {
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

    return <ProductGridClient products={products} />
  } catch (error) {
    console.error('Error fetching products:', error)
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load products. Please try again later.</p>
      </div>
    )
  }
}
