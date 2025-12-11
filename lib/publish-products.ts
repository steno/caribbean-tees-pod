#!/usr/bin/env tsx
/**
 * Publish Products Script
 * 
 * This script fixes products stuck in "Publishing" status by:
 * 1. Marking them as publishing_failed (to clear the stuck status)
 * 2. Publishing them via API
 * 
 * Run with: npm run publish-products
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

async function publishProducts() {
  console.log('🚀 Starting product publishing fix...\n')

  try {
    // Fetch all products from Printify
    console.log('📦 Fetching products from Printify API...')
    const products = await printifyService.getProducts()
    console.log(`✅ Found ${products.length} products\n`)

    let fixed = 0
    let errors = 0

    // Process each product
    for (const product of products) {
      try {
        console.log(`\n📝 Processing: ${product.title} (ID: ${product.id})`)
        
        // Step 1: Mark as publishing_failed to clear stuck status
        console.log('   Step 1: Marking as publishing_failed...')
        await printifyService.markPublishingFailed(product.id)
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Step 2: Publish the product
        console.log('   Step 2: Publishing product...')
        await printifyService.publishProduct(product.id)
        
        fixed++
        console.log(`   ✅ Successfully published: ${product.title}`)
        
        // Small delay between products
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error: any) {
        errors++
        console.error(`   ❌ Error processing ${product.title}:`, error.message)
      }
    }

    console.log('\n═══════════════════════════════════════')
    console.log(`✅ Publishing completed!`)
    console.log(`   • Products fixed: ${fixed}`)
    console.log(`   • Errors: ${errors}`)
    console.log('═══════════════════════════════════════\n')
  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the script
publishProducts()
