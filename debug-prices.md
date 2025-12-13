# Price Flow Analysis

## Complete Price Flow Path

### 1. **Source: Printify API**
   - **Location**: `lib/printify-service.ts` → `getProducts()`
   - **API Endpoint**: `https://api.printify.com/v1/shops/{shopId}/products.json`
   - **Returns**: `PrintifyVariant.price` (number, in USD)
   - **Format**: Decimal number (e.g., `29.43` for $29.43 USD)

### 2. **Sync to Firebase** 
   - **Location**: `lib/sync-products.ts` line 125
   - **Code**: `price: Math.round(variant.price * 100)`
   - **Conversion**: Multiplies by 100 to convert USD to cents
   - **Example**: 
     - Printify returns: `29.43` USD
     - Stored in Firebase: `2943` cents
   - **⚠️ POTENTIAL ISSUE**: If Printify already returns price in cents, this would double-convert!

### 3. **Storage: Firebase Firestore**
   - **Collection**: `products/{productId}/variants/{variantId}`
   - **Field**: `price` (number, stored as cents)
   - **Example**: `2943` (represents $29.43)

### 4. **Fetch from Firebase**
   - **Location**: `components/ProductGrid.tsx` lines 47-56
   - **Code**: Fetches variants from Firestore subcollection
   - **Returns**: Variant with `price: 2943` (cents)

### 5. **Display in UI**
   - **Location**: `components/ProductCard.tsx` line 324
   - **Code**: `formatPrice(selectedVariant.price)`
   - **Function**: `lib/utils.ts` line 8-13
   - **Code**: `new Intl.NumberFormat('en-US', { currency: 'USD' }).format(cents / 100)`
   - **Conversion**: Divides by 100 to convert cents back to USD
   - **Example**: 
     - Firebase value: `2943` cents
     - Display: `2943 / 100 = 29.43` → "$29.43"

### 6. **Add to Cart**
   - **Location**: `components/ProductCard.tsx` line 189
   - **Code**: `price: selectedVariant.price`
   - **Stored**: Price in cents (e.g., `2943`)

### 7. **Stripe Checkout**
   - **Location**: `app/api/checkout/route.ts` line 33
   - **Code**: `unit_amount: item.price` (price in cents)
   - **Currency**: `'usd'` (line 23)
   - **Example**: Sends `2943` cents to Stripe = $29.43

## 🔍 DIAGNOSIS: Why $2,943.00?

If you're seeing **$2,943.00**, the price stored in Firebase is likely **294,300 cents**.

**Possible causes:**

1. **Printify returns price in cents, not USD**
   - Printify returns: `2943` (already in cents)
   - Code multiplies: `2943 * 100 = 294,300` cents ❌
   - Display: `294,300 / 100 = $2,943.00` ❌

2. **Printify price is set incorrectly**
   - Printify dashboard shows: $2,943.00 USD
   - API returns: `2943.00`
   - Code multiplies: `2943.00 * 100 = 294,300` cents
   - Display: $2,943.00

3. **Double conversion somewhere**
   - Price gets multiplied twice somewhere in the flow

## 🔧 How to Debug

1. **Check Printify API response directly**
   - Look at what `variant.price` actually is from Printify
   - Is it `29.43` or `2943`?

2. **Check Firebase stored value**
   - Look at Firestore document: `products/{id}/variants/{variantId}`
   - What is the `price` field value?

3. **Check the conversion**
   - Line 125 in `sync-products.ts`: `Math.round(variant.price * 100)`
   - If Printify returns `29.43`, this should store `2943` ✓
   - If Printify returns `2943`, this stores `294300` ❌





