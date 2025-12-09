import { getAdminDb } from '@/lib/firebase-admin'
import { ProductCard } from './ProductCard'

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

export async function ProductGrid() {
  try {
    // Fetch products from Firestore
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

      products.push({
        id: doc.id,
        printify_product_id: productData.printify_product_id,
        title: productData.title,
        description: productData.description || null,
        main_image_url: productData.main_image_url || null,
        variants: variants,
      })
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

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load products. Please try again later.</p>
      </div>
    )
  }
}
