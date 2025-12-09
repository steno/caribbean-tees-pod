# 🌴 Caribbean Tees - Automated Print-on-Demand Store

A fully automated e-commerce platform for selling t-shirts with Caribbean and beach themes. Built with Next.js 14, integrated with Printify for fulfillment, Stripe for payments, and Supabase for data management.

## 🚀 Features

- **Automated Fulfillment**: Orders are automatically sent to Printify after payment
- **Product Sync**: Sync products from Printify API to your database
- **Beautiful Caribbean Theme**: Teals, corals, and sand color palette
- **Cart Management**: Persistent shopping cart with Zustand
- **Stripe Checkout**: Secure payment processing
- **Responsive Design**: Mobile-first, fully responsive UI
- **Variant Selection**: Support for different sizes and options

## 📋 Prerequisites

Before you begin, make sure you have:

- Node.js 18+ installed
- A Printify account with products set up
- A Stripe account (test mode is fine to start)
- A Supabase project

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Optional, for product sync

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

### 3. Set Up Supabase Database

Run the SQL schema in your Supabase SQL editor:

```bash
cat supabase/schema.sql
```

Copy and paste the contents into Supabase > SQL Editor and run it.

### 4. Get Printify Credentials

1. Log in to [Printify](https://printify.com/)
2. Go to **Settings** > **API**
3. Generate an API token
4. Find your Shop ID in the URL or API section

### 5. Set Up Products in Printify

1. Create products in your Printify shop
2. Set prices for each variant
3. Publish products to your shop

### 6. Sync Products to Database

Run the product sync script to pull products from Printify:

```bash
npm run sync-products
```

This will:
- Fetch all products from Printify
- Save them to your Supabase database
- Sync all variants with prices

Run this script whenever you update products in Printify.

### 7. Set Up Stripe Webhook (for Production)

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
3. **Order saved to database** → Supabase stores order details
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
│   ├── supabase.ts            # Supabase client
│   ├── printify-service.ts    # Printify API wrapper
│   ├── sync-products.ts       # Product sync script
│   └── utils.ts               # Utility functions
├── store/
│   └── cart-store.ts          # Zustand cart state
├── types/
│   ├── database.ts            # Supabase types
│   └── printify.ts            # Printify API types
└── supabase/
    └── schema.sql             # Database schema
```

## 🧪 Testing the Workflow

### Test with Stripe Test Cards

Use Stripe's test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`

### Monitor the Automation

Check your terminal logs to see:
1. Stripe webhook received
2. Order saved to database
3. Printify order submitted
4. Printify order ID

### Verify in Printify Dashboard

1. Go to Printify > Orders
2. You should see your test order
3. Status: "In Production" or "On Hold" (depending on your settings)

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
2. Check that products are published in Printify
3. Verify Supabase connection

### Webhook Not Working?

1. For local testing, use Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
2. Check webhook secret in `.env.local`
3. Verify endpoint in Stripe Dashboard

### Order Not Submitted to Printify?

1. Check terminal logs for errors
2. Verify Printify API token and Shop ID
3. Ensure variants exist in Printify
4. Check that products have correct `printify_product_id`

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy!
5. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
6. Set up production Stripe webhook with your Vercel URL

### Post-Deployment

1. Test the full checkout flow
2. Place a test order with Stripe test card
3. Verify order appears in Printify
4. Monitor webhook logs in Stripe Dashboard

## 📄 License

MIT License - feel free to use this for your own POD store!

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Stripe](https://stripe.com/)
- [Printify](https://printify.com/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Lucide Icons](https://lucide.dev/)

---

Made with 🌴 for the Caribbean community

