// Check what products exist in Printify
const token = process.env.PRINTIFY_API_TOKEN;
const shopId = process.env.PRINTIFY_SHOP_ID;

async function checkProducts() {
  console.log('\n🔍 Checking Printify products...\n');
  
  try {
    // Try to get products
    const response = await fetch(`https://api.printify.com/v1/shops/${shopId}/products.json`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const text = await response.text();
      console.log('Response:', text);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`✅ Found ${data.data ? data.data.length : data.length} products\n`);
    
    if (data.data) {
      data.data.forEach((product, i) => {
        console.log(`${i + 1}. ${product.title}`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Published: ${product.visible ? 'Yes' : 'No'}`);
        console.log(`   Variants: ${product.variants.length}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkProducts();

