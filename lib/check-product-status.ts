#!/usr/bin/env tsx
/**
 * Check Product Status Script
 * 
 * This script checks the actual publishing status of products in Printify
 * Run with: npm run check-product-status
 */

// Load environment variables FIRST before any imports
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Now import other modules after env vars are loaded
import { printifyService } from './printify-service'

if (!process.env.PRINTIFY_API_TOKEN || !process.env.PRINTIFY_SHOP_ID) {
  console.error('❌ Missing Printify credentials in environment variables')
  process.exit(1)
}

async function checkProductStatus() {
  console.log('🔍 Checking product publishing status...\n')

  try {
    // Fetch all products from Printify
    console.log('📦 Fetching products from Printify API...')
    const products = await printifyService.getProducts()
    console.log(`✅ Found ${products.length} products\n`)

    for (const product of products) {
      try {
        // Fetch full product details to see actual status
        const fullProduct = await printifyService.getProduct(product.id)
        
        console.log(`\n📝 Product: ${product.title}`)
        console.log(`   ID: ${product.id}`)
        console.log(`   Visible: ${product.visible ? '✅ Yes' : '❌ No'}`)
        console.log(`   Is Locked: ${product.is_locked ? '🔒 Yes' : '🔓 No'}`)
        console.log(`   Variants: ${product.variants.length}`)
        console.log(`   Images: ${product.images.length}`)
        console.log(`   Tags: ${product.tags.length}`)
        
        // Check if product has publishing-related properties
        if ('published_at' in fullProduct) {
          console.log(`   Published At: ${(fullProduct as any).published_at || 'Not published'}`)
        }
      } catch (error: any) {
        console.error(`   ❌ Error checking ${product.title}:`, error.message)
      }
    }

    console.log('\n═══════════════════════════════════════')
    console.log('✅ Status check completed!\n')
  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the script
checkProductStatus()
