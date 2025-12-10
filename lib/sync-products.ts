#!/usr/bin/env tsx
/**
 * Product Sync Script - Firebase Version
 * 
 * This script fetches all products from Printify and syncs them to your Firebase Firestore.
 * Run with: npm run sync-products
 * 
 * This ensures your site always has up-to-date pricing, images, and availability.
 */

// Load environment variables FIRST before any imports
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Now import other modules after env vars are loaded
import { getAdminDb } from './firebase-admin'
import { printifyService } from './printify-service'

if (!process.env.PRINTIFY_API_TOKEN || !process.env.PRINTIFY_SHOP_ID) {
  console.error('❌ Missing Printify credentials in environment variables')
  process.exit(1)
}

if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.error('❌ Missing Firebase credentials in environment variables')
  process.exit(1)
}

async function syncProducts() {
  console.log('🚀 Starting product sync from Printify to Firebase...\n')

  try {
    const db = getAdminDb()
    
    // Fetch all products from Printify
    console.log('📦 Fetching products from Printify API...')
    const printifyProducts = await printifyService.getProducts()
    console.log(`✅ Found ${printifyProducts.length} products\n`)

    let synced = 0
    let errors = 0

    // Get all Printify product IDs to track which ones should be hidden
    const printifyProductIds = new Set(printifyProducts.map(p => p.id))
    
    for (const printifyProduct of printifyProducts) {
      try {
        console.log(`📝 Syncing: ${printifyProduct.title}`)
        
        // Mark hidden products in Firestore
        if (!printifyProduct.visible) {
          const productRef = db.collection('products').doc(printifyProduct.id)
          await productRef.update({
            visible: false,
            updated_at: new Date().toISOString(),
          })
          console.log(`   ⏭️  Marked as hidden: ${printifyProduct.title}`)
          continue
        }

        // Find the default image (or first available)
        const defaultImage = printifyProduct.images.find(img => img.is_default)
        const mainImageUrl = defaultImage?.src || printifyProduct.images[0]?.src || null

        // Prepare product data
        const productData = {
          printify_product_id: printifyProduct.id,
          title: printifyProduct.title,
          description: printifyProduct.description || '',
          main_image_url: mainImageUrl,
          options: printifyProduct.options, // Store options for proper color/size extraction
          tags: printifyProduct.tags || [], // Store tags for filtering (men, women, etc.)
          visible: printifyProduct.visible, // Store visibility status
          updated_at: new Date().toISOString(),
        }

        // Upsert product using printify_product_id as document ID
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

        console.log(`   ✓ Product synced: ${printifyProduct.id}`)

        // Sync variants as subcollection with images
        const variantsToSync = printifyProduct.variants
          .filter(v => v.is_enabled && v.is_available)

        // Get current variant IDs from Printify
        const printifyVariantIds = new Set(variantsToSync.map(v => v.id.toString()))
        
        // Get existing variants from Firestore
        const existingVariantsSnapshot = await productRef.collection('variants').get()
        const variantsToDelete: string[] = []
        
        // Find variants that no longer exist in Printify
        existingVariantsSnapshot.forEach(variantDoc => {
          if (!printifyVariantIds.has(variantDoc.id)) {
            variantsToDelete.push(variantDoc.id)
          }
        })

        if (variantsToSync.length > 0) {
          const batch = db.batch()
          
          for (const variant of variantsToSync) {
            // Find the image for this variant
            const variantImage = printifyProduct.images.find(img => 
              img.variant_ids && img.variant_ids.includes(variant.id)
            )
            
            const variantRef = productRef.collection('variants').doc(variant.id.toString())
            batch.set(variantRef, {
              printify_variant_id: variant.id,
              title: variant.title,
              price: Math.round(variant.price * 100), // Convert to cents
              is_available: variant.is_available,
              sku: variant.sku || '',
              image_url: variantImage?.src || mainImageUrl, // Use variant-specific image or fall back to main
              option_ids: variant.options, // Store option IDs to map to colors/sizes
              updated_at: new Date().toISOString(),
            }, { merge: true })
          }
          
          // Delete variants that no longer exist in Printify
          for (const variantId of variantsToDelete) {
            const variantRef = productRef.collection('variants').doc(variantId)
            batch.delete(variantRef)
          }

          await batch.commit()
          console.log(`   ✓ Synced ${variantsToSync.length} variants with images`)
          if (variantsToDelete.length > 0) {
            console.log(`   🗑️  Deleted ${variantsToDelete.length} old variants no longer in Printify`)
          }
        } else if (variantsToDelete.length > 0) {
          // If no variants to sync but there are old ones to delete
          const batch = db.batch()
          for (const variantId of variantsToDelete) {
            const variantRef = productRef.collection('variants').doc(variantId)
            batch.delete(variantRef)
          }
          await batch.commit()
          console.log(`   🗑️  Deleted ${variantsToDelete.length} old variants no longer in Printify`)
        }

        synced++
      } catch (error) {
        console.error(`   ✗ Error syncing ${printifyProduct.title}:`, error)
        errors++
      }

      console.log('') // Empty line for readability
    }
    
    // Mark products as hidden if they're no longer in Printify
    const allFirestoreProducts = await db.collection('products').get()
    let hiddenCount = 0
    
    for (const doc of allFirestoreProducts.docs) {
      const productData = doc.data()
      // If product exists in Firestore but not in current Printify sync, mark as hidden
      if (!printifyProductIds.has(doc.id) && productData.visible !== false) {
        await doc.ref.update({
          visible: false,
          updated_at: new Date().toISOString(),
        })
        hiddenCount++
      }
    }
    
    if (hiddenCount > 0) {
      console.log(`   ⏭️  Marked ${hiddenCount} products as hidden (not in Printify)\n`)
    }

    console.log('═══════════════════════════════════════')
    console.log(`✅ Sync completed!`)
    console.log(`   • Products synced: ${synced}`)
    console.log(`   • Errors: ${errors}`)
    console.log('═══════════════════════════════════════\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Fatal error during sync:', error)
    process.exit(1)
  }
}

// Run the sync
syncProducts()
