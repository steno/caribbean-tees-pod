#!/usr/bin/env tsx
/**
 * Product Sync Script
 * 
 * This script fetches all products from Printify and syncs them to your Supabase database.
 * Run with: npm run sync-products
 * 
 * This ensures your site always has up-to-date pricing, images, and availability.
 */

import { createClient } from '@supabase/supabase-js'
import { printifyService } from './printify-service'
import { Database } from '@/types/database'

// Load environment variables
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in environment variables')
  process.exit(1)
}

if (!process.env.PRINTIFY_API_TOKEN || !process.env.PRINTIFY_SHOP_ID) {
  console.error('❌ Missing Printify credentials in environment variables')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

async function syncProducts() {
  console.log('🚀 Starting product sync from Printify...\n')

  try {
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

        // Upsert product
        const { data: product, error: productError } = await supabase
          .from('products')
          .upsert({
            printify_product_id: printifyProduct.id,
            title: printifyProduct.title,
            description: printifyProduct.description,
            main_image_url: mainImageUrl,
          }, {
            onConflict: 'printify_product_id',
          })
          .select()
          .single()

        if (productError) {
          throw productError
        }

        console.log(`   ✓ Product synced: ${product.id}`)

        // Sync variants
        const variantsToSync = printifyProduct.variants
          .filter(v => v.is_enabled && v.is_available)
          .map(variant => ({
            product_id: product.id,
            printify_variant_id: variant.id,
            title: variant.title,
            price: Math.round(variant.price * 100), // Convert to cents
            is_available: variant.is_available,
          }))

        if (variantsToSync.length > 0) {
          const { error: variantsError } = await supabase
            .from('product_variants')
            .upsert(variantsToSync, {
              onConflict: 'product_id,printify_variant_id',
            })

          if (variantsError) {
            throw variantsError
          }

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

