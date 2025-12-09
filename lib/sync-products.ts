#!/usr/bin/env tsx
/**
 * Product Sync Script - Firebase Version
 * 
 * This script fetches all products from Printify and syncs them to your Firebase Firestore.
 * Run with: npm run sync-products
 * 
 * This ensures your site always has up-to-date pricing, images, and availability.
 */

import { getAdminDb } from './firebase-admin'
import { printifyService } from './printify-service'

// Load environment variables
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

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

    for (const printifyProduct of printifyProducts) {
      try {
        console.log(`📝 Syncing: ${printifyProduct.title}`)

        // Find the default image (or first available)
        const defaultImage = printifyProduct.images.find(img => img.is_default)
        const mainImageUrl = defaultImage?.src || printifyProduct.images[0]?.src || null

        // Prepare product data
        const productData = {
          printify_product_id: printifyProduct.id,
          title: printifyProduct.title,
          description: printifyProduct.description || '',
          main_image_url: mainImageUrl,
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

        // Sync variants as subcollection
        const variantsToSync = printifyProduct.variants
          .filter(v => v.is_enabled && v.is_available)

        if (variantsToSync.length > 0) {
          const batch = db.batch()
          
          for (const variant of variantsToSync) {
            const variantRef = productRef.collection('variants').doc(variant.id.toString())
            batch.set(variantRef, {
              printify_variant_id: variant.id,
              title: variant.title,
              price: Math.round(variant.price * 100), // Convert to cents
              is_available: variant.is_available,
              sku: variant.sku || '',
              updated_at: new Date().toISOString(),
            }, { merge: true })
          }

          await batch.commit()
          console.log(`   ✓ Synced ${variantsToSync.length} variants`)
        }

        synced++
      } catch (error) {
        console.error(`   ✗ Error syncing ${printifyProduct.title}:`, error)
        errors++
      }

      console.log('') // Empty line for readability
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
