#!/usr/bin/env node
/**
 * Debug script to check what prices Printify API actually returns
 * Run: node debug-printify-prices.js
 */

require('dotenv').config({ path: '.env.local' })

const PRINTIFY_API_BASE = 'https://api.printify.com/v1'
const shopId = process.env.PRINTIFY_SHOP_ID
const apiToken = process.env.PRINTIFY_API_TOKEN

if (!shopId || !apiToken) {
  console.error('❌ Missing PRINTIFY_SHOP_ID or PRINTIFY_API_TOKEN in .env.local')
  process.exit(1)
}

async function debugPrices() {
  try {
    console.log('🔍 Fetching products from Printify API...\n')
    
    const response = await fetch(
      `${PRINTIFY_API_BASE}/shops/${shopId}/products.json`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Printify API error: ${response.statusText}`)
    }

    const data = await response.json()
    const products = data.data || []

    console.log(`✅ Found ${products.length} products\n`)
    console.log('═══════════════════════════════════════════════════════\n')

    for (const product of products.slice(0, 3)) { // Show first 3 products
      console.log(`📦 Product: ${product.title}`)
      console.log(`   ID: ${product.id}`)
      
      if (product.variants && product.variants.length > 0) {
        console.log(`\n   Variants (showing first 3):`)
        product.variants.slice(0, 3).forEach((variant, idx) => {
          console.log(`\n   Variant ${idx + 1}:`)
          console.log(`     • ID: ${variant.id}`)
          console.log(`     • Title: ${variant.title}`)
          console.log(`     • Price (raw from API): ${variant.price}`)
          console.log(`     • Price type: ${typeof variant.price}`)
          console.log(`     • Cost: ${variant.cost}`)
          console.log(`     • Is Available: ${variant.is_available}`)
          
          // Show what would be stored
          const storedPrice = Math.round(variant.price * 100)
          const displayPrice = storedPrice / 100
          console.log(`\n     🔄 Conversion:`)
          console.log(`        Printify price: ${variant.price}`)
          console.log(`        × 100 (to cents): ${storedPrice} cents`)
          console.log(`        ÷ 100 (display): $${displayPrice.toFixed(2)}`)
          
          if (variant.price > 100) {
            console.log(`        ⚠️  WARNING: Price > 100 suggests it might already be in cents!`)
          }
        })
      }
      
      console.log('\n   ───────────────────────────────────────────────────\n')
    }

    console.log('═══════════════════════════════════════════════════════')
    console.log('\n💡 Analysis:')
    console.log('   • If prices are < 100 (e.g., 29.43), they are in USD ✓')
    console.log('   • If prices are > 100 (e.g., 2943), they might be in cents ⚠️')
    console.log('   • Current code multiplies by 100, so:')
    console.log('     - If Printify returns 29.43 → stores 2943 cents → displays $29.43 ✓')
    console.log('     - If Printify returns 2943 → stores 294300 cents → displays $2,943.00 ❌')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

debugPrices()


