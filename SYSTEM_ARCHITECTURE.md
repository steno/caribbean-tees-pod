# 🏗️ System Architecture Overview

## 🎯 The Automated Workflow

```
┌─────────────┐
│   Customer  │
│   Visits    │
│   Website   │
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│   Next.js Frontend       │
│   - Product Grid         │
│   - Variant Selection    │
│   - Shopping Cart        │
└──────────┬───────────────┘
           │
           │ Clicks "Checkout"
           ▼
┌──────────────────────────┐
│  /api/checkout           │
│  Creates Stripe Session  │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│   Stripe Checkout Page   │
│   (Hosted by Stripe)     │
│   - Payment Form         │
│   - Shipping Address     │
└──────────┬───────────────┘
           │
           │ Payment Success
           ▼
┌──────────────────────────┐
│  Stripe Webhook          │
│  checkout.session.       │
│  completed Event         │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  /api/webhooks/stripe    │
│  🔥 THE AUTOMATION 🔥    │
│  ┌────────────────────┐  │
│  │ 1. Parse event     │  │
│  │ 2. Extract details │  │
│  │ 3. Save to DB      │  │
│  │ 4. Format order    │  │
│  │ 5. Submit order    │  │
│  └────────────────────┘  │
└──────────┬───────────────┘
           │
           ├─────────────────┐
           │                 │
           ▼                 ▼
    ┌──────────┐      ┌──────────────┐
    │ Supabase │      │   Printify   │
    │ Database │      │   API POST   │
    │          │      │   /orders    │
    │ Order ID │      │              │
    └──────────┘      └──────┬───────┘
                             │
                             ▼
                      ┌──────────────┐
                      │  Printify    │
                      │  Fulfillment │
                      │  - Print     │
                      │  - Package   │
                      │  - Ship      │
                      └──────┬───────┘
                             │
                             ▼
                      ┌──────────────┐
                      │   Customer   │
                      │   Receives   │
                      │   Product    │
                      └──────────────┘
```

---

## 📂 File Structure & Purpose

### **Core Automation Files** 🚀

#### 1. `app/api/webhooks/stripe/route.ts`
**THE MOST CRITICAL FILE** - This is where the magic happens!

```typescript
export async function POST(req: Request) {
  // 1. Verify Stripe webhook signature
  // 2. Handle checkout.session.completed event
  // 3. Extract customer & shipping info
  // 4. Save order to database
  // 5. Format order for Printify API
  // 6. Submit to Printify automatically
  // 7. Update database with Printify order ID
}
```

**What it does**: Bridges Stripe payments to Printify fulfillment with zero manual intervention.

#### 2. `lib/printify-service.ts`
Wrapper for Printify API calls:
- `getProducts()` - Fetch all products
- `getProduct(id)` - Get single product
- `createOrder()` - **Submit order to Printify** ⭐
- `getOrder(id)` - Check order status
- `calculateShipping()` - Get shipping costs

#### 3. `lib/sync-products.ts`
CLI script to sync products from Printify to database:
```bash
npm run sync-products
```
- Fetches all products from Printify API
- Saves to Supabase
- Syncs variants with prices
- Updates existing products

---

### **Frontend Components** 🎨

#### 1. `app/page.tsx`
Landing page with:
- Hero section (Caribbean beach theme)
- Product grid
- Features section

#### 2. `components/ProductCard.tsx`
Individual product display:
- Product image
- Variant selector (sizes)
- Price display
- Add to cart button

#### 3. `components/CartSlideOver.tsx`
Shopping cart drawer:
- Cart items list
- Quantity controls
- Total calculation
- Checkout button

#### 4. `components/Header.tsx`
Site header:
- Logo
- Cart icon with badge

---

### **State Management** 📦

#### `store/cart-store.ts` (Zustand)
Shopping cart state:
```typescript
{
  items: CartItem[]        // Cart contents
  isOpen: boolean          // Cart drawer open/closed
  addItem()               // Add product to cart
  removeItem()            // Remove from cart
  updateQuantity()        // Change item quantity
  getTotalPrice()         // Calculate total
}
```

**Persisted to localStorage** - cart survives page reloads!

---

### **Database Schema** 🗄️

#### `supabase/schema.sql`

**Tables:**

1. **products**
   - Synced from Printify
   - Title, description, image
   - Links to variants

2. **product_variants**
   - Sizes, colors
   - Prices
   - Printify variant IDs ⭐

3. **orders**
   - Customer info
   - Shipping address
   - Line items
   - Stripe session ID
   - **Printify order ID** ⭐
   - Order status

---

## 🔑 Key Data Flow: Order Processing

### Step 1: Customer Checkout
```typescript
// app/api/checkout/route.ts
const session = await stripe.checkout.sessions.create({
  line_items: [...],
  metadata: {
    printify_variant_id,  // ⭐ Critical for fulfillment
    printify_product_id
  }
})
```

### Step 2: Stripe Webhook Receives Payment
```typescript
// app/api/webhooks/stripe/route.ts
event.type === 'checkout.session.completed'
```

### Step 3: Extract Data
```typescript
const { shipping_details, line_items } = session
const printify_variant_id = metadata.printify_variant_id
```

### Step 4: Save to Database
```typescript
await supabase.from('orders').insert({
  stripe_session_id,
  customer_email,
  shipping_address,
  line_items: [{
    printify_product_id,
    printify_variant_id,  // ⭐ The key link
    quantity
  }]
})
```

### Step 5: Submit to Printify
```typescript
const printifyOrder = {
  line_items: [{
    product_id: printify_product_id,
    variant_id: printify_variant_id,  // ⭐ Tells Printify exact size
    quantity
  }],
  address_to: { /* shipping info */ },
  send_shipping_notification: true
}

await printifyService.createOrder(printifyOrder)
```

### Step 6: Update Database with Printify ID
```typescript
await supabase.from('orders').update({
  printify_order_id: response.id,
  status: 'submitted_to_printify'
})
```

---

## 🎨 Caribbean Beach Theme

### Color Palette
```typescript
// tailwind.config.ts
sand:  { 500: '#c9af8f' }  // Warm beach sand
ocean: { 500: '#00acd4' }  // Crystal clear water
coral: { 500: '#ff6b4a' }  // Sunset coral
palm:  { 500: '#52975f' }  // Palm tree green
```

### Design Elements
- Gradient headers (ocean to coral)
- Wave SVG decorations
- Island emoji accents (🌴🌊⛵)
- Smooth animations
- Mobile-first responsive

---

## 🔐 Environment Variables

### Required for Operation:

```env
# Supabase - Database
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY (for sync script)

# Stripe - Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET (critical for webhook security)

# Printify - Fulfillment
PRINTIFY_API_TOKEN
PRINTIFY_SHOP_ID

# App Config
NEXT_PUBLIC_APP_URL (for Stripe redirects)
```

---

## 🚦 Testing the Complete Flow

### Local Test:

1. **Terminal 1**: Run app
   ```bash
   npm run dev
   ```

2. **Terminal 2**: Run Stripe webhook listener
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. **Browser**: 
   - Visit http://localhost:3000
   - Add product to cart
   - Checkout with test card: `4242 4242 4242 4242`

4. **Watch Logs**:
   ```
   ✅ Stripe webhook received
   ✅ Order saved to database
   ✅ Printify order submitted
   ✅ Printify order ID: xxxxxxxxx
   ```

5. **Verify**: Check Printify dashboard for order

---

## 📊 Database Relationships

```
products (1) ──→ (many) product_variants
                           ↓
                      (referenced by)
                           ↓
                        orders
                           ↓
                    (has many)
                           ↓
                      line_items
```

---

## 🔄 Product Sync Flow

```
Printify API
    ↓
lib/sync-products.ts
    ↓
Supabase Database
    ↓
Next.js App (SSR)
    ↓
Product Grid Display
```

Run manually: `npm run sync-products`
Or set up cron job for automatic updates.

---

## 🛡️ Security Features

1. **Stripe Webhook Verification**
   - Signature checking prevents fake webhooks
   - Webhook secret validates authenticity

2. **Environment Variables**
   - All secrets in `.env.local`
   - Never committed to git
   - Separate for development/production

3. **Supabase Row Level Security**
   - Can enable RLS policies
   - Restrict database access

4. **API Route Protection**
   - Webhook requires valid signature
   - Checkout validates cart data

---

## 📈 Scalability Considerations

### Current Setup Handles:
- ✅ Multiple concurrent orders
- ✅ Automatic retry (Stripe retries failed webhooks)
- ✅ Database indexing on key fields
- ✅ Printify rate limits (handled by their API)

### For High Volume:
- Add queue system (BullMQ, Redis)
- Implement webhook retry logic
- Cache product data
- Use Supabase connection pooling

---

## 🎓 Technology Choices Explained

### Why Next.js 14?
- App Router for modern React patterns
- API routes for backend logic
- SSR for SEO and performance
- Image optimization built-in

### Why Supabase?
- PostgreSQL (reliable, scalable)
- Real-time capabilities
- Easy to query
- Free tier generous

### Why Zustand?
- Lightweight (< 1KB)
- Simple API
- Persistence middleware
- No boilerplate

### Why Printify?
- No inventory needed
- Worldwide fulfillment
- Quality products
- API for automation

### Why Stripe?
- Industry standard
- Excellent developer experience
- Built-in fraud protection
- Supports many countries

---

## 🔧 Customization Points

### Easy to Modify:

1. **Colors**: Edit `tailwind.config.ts`
2. **Products**: Update in Printify, run sync
3. **Shipping**: Change countries in checkout route
4. **Pricing**: Adjust in Printify
5. **Theme**: Modify components
6. **Copy/Text**: Edit page content

### Requires Code Changes:

1. **Payment processor**: Replace Stripe (not recommended)
2. **Print provider**: Replace Printify (requires new service)
3. **Database**: Replace Supabase (requires schema migration)

---

## 📞 Support & Resources

- **Full Setup**: See `README.md`
- **Quick Start**: See `QUICK_START.md`
- **Deploy**: See `DEPLOYMENT.md`
- **This File**: Architecture overview

---

**Built with ❤️ for automated e-commerce**

The entire system is designed to run hands-free once configured. 
You focus on marketing and customer service - the system handles everything else!

🌴 Happy selling! 👕

