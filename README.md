# 🌴 Caribbean Tees - Automated Print-on-Demand Store

A fully automated e-commerce platform for selling t-shirts with Caribbean and beach themes. Built with Next.js 14, integrated with Printify for fulfillment, Stripe for payments, and **Firebase Firestore** for data management.

## 🚀 Features

- **Automated Fulfillment**: Orders are automatically sent to Printify after payment
- **Product Sync**: Sync products from Printify API to your database
- **Beautiful Caribbean Theme**: Teals, corals, and sand color palette
- **Cart Management**: Persistent shopping cart with Zustand
- **Stripe Checkout**: Secure payment processing
- **Responsive Design**: Mobile-first, fully responsive UI
- **Variant Selection**: Support for different sizes and options
- **Firebase Firestore**: NoSQL database with real-time capabilities

## 📋 Prerequisites

Before you begin, make sure you have:

- Node.js 18+ installed
- A Printify account with products set up
- A Stripe account (test mode is fine to start)
- A Firebase project

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase

**Follow the complete guide:** See [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md)

Quick version:
1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Get web app credentials
4. Download service account key
5. Deploy security rules from `firebase/firestore.rules`

### 3. Set Up Environment Variables

Create `.env.local` in project root:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Printify
PRINTIFY_API_TOKEN=your_printify_token
PRINTIFY_SHOP_ID=your_shop_id

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Get Printify Credentials

1. Log in to [Printify](https://printify.com/)
2. Go to **Settings** > **API**
3. Generate an API token
4. Find your Shop ID in the URL or API section

### 5. Set Up Products in Printify

1. Create products in your Printify shop
2. Set prices for each variant
3. Publish products to your shop

### 6. Sync Products to Firebase

Run the product sync script to pull products from Printify:

```bash
npm run sync-products
```

This will:
- Fetch all products from Printify
- Save them to your Firebase Firestore
- Create variants as subcollections
- Sync prices and availability

Run this script whenever you update products in Printify.

### 7. Set Up Stripe Webhook (for Local Testing)

For local testing, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will give you a webhook secret starting with `whsec_test_...`

For production:
1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select event: `checkout.session.completed`
4. Copy the webhook secret to your `.env.local`

### 8. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your store!

## 🔄 How the Automation Works

1. **Customer places order** → Stripe Checkout processes payment
2. **Stripe webhook fires** → Your API receives `checkout.session.completed`
3. **Order saved to Firestore** → Firebase stores order details
4. **Printify API called** → Order automatically submitted to Printify
5. **Printify fulfills** → Prints shirt and ships to customer
6. **Customer notified** → Printify sends tracking info via email

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── checkout/          # Stripe Checkout session creation
│   │   └── webhooks/stripe/   # Stripe webhook handler (THE BRIDGE)
│   ├── success/               # Order confirmation page
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/
│   ├── Header.tsx             # Site header with cart button
│   ├── CartSlideOver.tsx      # Shopping cart drawer
│   ├── ProductCard.tsx        # Individual product card
│   └── ProductGrid.tsx        # Product listing
├── lib/
│   ├── firebase.ts            # Firebase client
│   ├── firebase-admin.ts      # Firebase Admin SDK
│   ├── printify-service.ts    # Printify API wrapper
│   ├── sync-products.ts       # Product sync script
│   └── utils.ts               # Utility functions
├── store/
│   └── cart-store.ts          # Zustand cart state
├── types/
│   └── printify.ts            # Printify API types
└── firebase/
    ├── firestore.rules        # Security rules
    └── firestore.indexes.json # Index configuration
```

## 🗄️ Firestore Structure

```
products (collection)
  └── {printifyProductId} (document)
      ├── title: string
      ├── description: string
      ├── main_image_url: string
      ├── printify_product_id: string
      └── variants (subcollection)
          └── {variantId} (document)
              ├── printify_variant_id: number
              ├── title: string
              ├── price: number (cents)
              └── is_available: boolean

orders (collection)
  └── {orderId} (document)
      ├── stripe_session_id: string
      ├── printify_order_id: string
      ├── customer_email: string
      ├── shipping_address: object
      ├── total_amount: number
      ├── status: string
      └── line_items: array
```

## 🧪 Testing the Workflow

### Test with Stripe Test Cards

Use Stripe's test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`

### Monitor the Automation

Check your terminal logs to see:
1. Stripe webhook received
2. Order saved to Firestore
3. Printify order submitted
4. Printify order ID

### Verify in Firebase Console

1. Go to Firebase Console > Firestore Database
2. Check `orders` collection for your test order
3. Verify `printify_order_id` is present

### Verify in Printify Dashboard

1. Go to Printify > Orders
2. You should see your test order
3. Status: "In Production" or "On Hold"

## 🚀 Deployment

### Deploy to Netlify

**Complete guide:** See [`NETLIFY_DEPLOYMENT.md`](./NETLIFY_DEPLOYMENT.md)

Quick version:
1. Push to GitHub (already done!)
2. Import to Netlify
3. Add all environment variables
4. Deploy!
5. Set up production Stripe webhook
6. Test live site

## 📖 Documentation

- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Complete Firebase setup
- **[NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md)** - Netlify deployment guide
- **[QUICK_START.md](./QUICK_START.md)** - Fast 10-minute setup
- **[FIREBASE_MIGRATION_SUMMARY.md](./FIREBASE_MIGRATION_SUMMARY.md)** - What changed from Supabase
- **[SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)** - Technical deep dive
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Feature overview

## 🔧 Configuration

### Shipping Methods

Edit `lib/printify-service.ts` to change the shipping method:

```typescript
shipping_method: 1, // 1 = Standard, 2 = Express
```

### Auto-Approve Orders

In Printify Dashboard > Settings:
- Enable "Auto-approve orders" to skip manual approval
- Disable to review each order before printing

### Supported Countries

Edit `app/api/checkout/route.ts` to add/remove shipping countries:

```typescript
allowed_countries: ['US', 'CA', 'GB', 'JM', 'BB', 'TT', 'BS']
```

## 📱 Responsive Design

The site is fully responsive and tested on:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

## 🎨 Customizing Colors

Edit `tailwind.config.ts` to customize the beach theme colors:

```typescript
colors: {
  sand: { ... },
  ocean: { ... },
  coral: { ... },
  palm: { ... },
}
```

## 🐛 Troubleshooting

### Products Not Showing?

1. Make sure you've run `npm run sync-products`
2. Check Firebase Console for products
3. Verify Firebase credentials in `.env.local`

### Webhook Not Working?

1. For local testing, use Stripe CLI
2. Check webhook secret in `.env.local`
3. Verify endpoint in Stripe Dashboard
4. Check Netlify Function logs

### Order Not Submitted to Printify?

1. Check terminal logs for errors
2. Verify Printify API token and Shop ID
3. Ensure variants exist in Printify
4. Check Firestore for order document

### Firebase Permission Errors?

1. Deploy security rules from `firebase/firestore.rules`
2. Verify service account credentials
3. Check Firebase Console > Firestore > Rules

## 💰 Firebase Pricing

### Free Tier
- 1 GB storage
- 50K document reads/day
- 20K document writes/day
- 20K document deletes/day

**Perfect for starting out!** Most small stores stay under these limits.

### When to Upgrade
Upgrade to Blaze (pay-as-you-go) when:
- More than 50K page views/day
- Need more storage
- Want Cloud Functions

## 📊 Tech Stack Summary

| Layer | Technology | Why? |
|-------|-----------|------|
| Framework | Next.js 14 | Modern React, API routes, SSR |
| Styling | Tailwind CSS | Fast, responsive, customizable |
| Icons | Lucide React | Beautiful, tree-shakeable |
| Database | Firebase Firestore | NoSQL, real-time, auto-scaling |
| Payments | Stripe | Industry standard |
| Fulfillment | Printify | No inventory needed |
| State | Zustand | Lightweight, simple |
| Language | TypeScript | Type safety, better DX |

## 📄 License

MIT License - feel free to use this for your own POD store!

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Stripe](https://stripe.com/)
- [Printify](https://printify.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Lucide Icons](https://lucide.dev/)

---

Made with 🌴 and 🔥 for the Caribbean community
