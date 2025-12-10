import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'
import { printifyService } from '@/lib/printify-service'

// Optional: Add a secret token for security
const SYNC_SECRET = process.env.SYNC_SECRET || 'your-secret-token-here'

export async function POST(req: Request) {
  try {
    // Optional: Verify secret token
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${SYNC_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const db = getAdminDb()
    
    // Fetch all products from Printify
    const printifyProducts = await printifyService.getProducts()
    const printifyProductIds = new Set(printifyProducts.map(p => p.id))

    let synced = 0
    let errors = 0
    let hiddenCount = 0

    for (const printifyProduct of printifyProducts) {
      try {
        // Mark hidden products
        if (!printifyProduct.visible) {
          const productRef = db.collection('products').doc(printifyProduct.id)
          await productRef.update({
            visible: false,
            updated_at: new Date().toISOString(),
          })
          continue
        }

        // Find the default image
        const defaultImage = printifyProduct.images.find(img => img.is_default)
        const mainImageUrl = defaultImage?.src || printifyProduct.images[0]?.src || null

        // Prepare product data
        const productData = {
          printify_product_id: printifyProduct.id,
          title: printifyProduct.title,
          description: printifyProduct.description || '',
          main_image_url: mainImageUrl,
          options: printifyProduct.options,
          tags: printifyProduct.tags || [],
          visible: printifyProduct.visible,
          updated_at: new Date().toISOString(),
        }

        // Upsert product
        const productRef = db.collection('products').doc(printifyProduct.id)
        const productDoc = await productRef.get()
        
        if (!productDoc.exists) {
          await productRef.set({
            ...productData,
            created_at: new Date().toISOString(),
          })
        } else {
          await productRef.update(productData)
        }

        // Sync variants
        const variantsToSync = printifyProduct.variants
          .filter(v => v.is_enabled && v.is_available)

        const printifyVariantIds = new Set(variantsToSync.map(v => v.id.toString()))
        const existingVariantsSnapshot = await productRef.collection('variants').get()
        const variantsToDelete: string[] = []
        
        existingVariantsSnapshot.forEach(variantDoc => {
          if (!printifyVariantIds.has(variantDoc.id)) {
            variantsToDelete.push(variantDoc.id)
          }
        })

        if (variantsToSync.length > 0) {
          const batch = db.batch()
          
          for (const variant of variantsToSync) {
            const variantImage = printifyProduct.images.find(img => 
              img.variant_ids && img.variant_ids.includes(variant.id)
            )
            
            const variantRef = productRef.collection('variants').doc(variant.id.toString())
            batch.set(variantRef, {
              printify_variant_id: variant.id,
              title: variant.title,
              price: Math.round(variant.price * 100),
              is_available: variant.is_available,
              sku: variant.sku || '',
              image_url: variantImage?.src || mainImageUrl,
              option_ids: variant.options,
              updated_at: new Date().toISOString(),
            }, { merge: true })
          }
          
          for (const variantId of variantsToDelete) {
            const variantRef = productRef.collection('variants').doc(variantId)
            batch.delete(variantRef)
          }

          await batch.commit()
        }

        synced++
      } catch (error) {
        console.error(`Error syncing ${printifyProduct.title}:`, error)
        errors++
      }
    }
    
    // Mark products as hidden if they're no longer in Printify
    const allFirestoreProducts = await db.collection('products').get()
    
    for (const doc of allFirestoreProducts.docs) {
      const productData = doc.data()
      if (!printifyProductIds.has(doc.id) && productData.visible !== false) {
        await doc.ref.update({
          visible: false,
          updated_at: new Date().toISOString(),
        })
        hiddenCount++
      }
    }

    return NextResponse.json({
      success: true,
      synced,
      errors,
      hidden: hiddenCount,
      message: `Synced ${synced} products, ${errors} errors, ${hiddenCount} hidden`
    })
  } catch (error: any) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: error.message || 'Sync failed' },
      { status: 500 }
    )
  }
}
