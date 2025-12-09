# 🚀 Quick Start Guide

Get your Caribbean Tees store running in 10 minutes!

## Step 1: Install Dependencies (1 min)

```bash
npm install
```

## Step 2: Create `.env.local` File (2 min)

Create a file called `.env.local` in the root directory with:

```env
# Supabase (get from: https://app.supabase.com/project/_/settings/api)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...  # Optional for sync script

# Stripe (get from: https://dashboard.stripe.com/test/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...  # Get this in step 6

# Printify (get from: https://printify.com/app/account/api)
PRINTIFY_API_TOKEN=eyJ0...
PRINTIFY_SHOP_ID=123456

# Your app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 3: Set Up Database (3 min)

1. Go to [Supabase](https://app.supabase.com)
2. Create a new project (or use existing)
3. Go to **SQL Editor**
4. Copy the contents of `supabase/schema.sql`
5. Paste and click **Run**

✅ Your database is now ready!

## Step 4: Set Up Printify (2 min)

1. Go to [Printify](https://printify.com/)
2. Create/design some products
3. **Important**: Set prices for all variants (sizes)
4. Publish products to your shop
5. Go to Settings > API and generate a token
6. Copy your Shop ID (found in the URL or API section)

## Step 5: Sync Products (1 min)

```bash
npm run sync-products
```

This pulls all your Printify products into your database.

## Step 6: Set Up Stripe Webhook (1 min)

Open a new terminal and run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook secret (`whsec_test_...`) and add it to `.env.local`

**Note**: You need the [Stripe CLI](https://stripe.com/docs/stripe-cli) installed.

## Step 7: Start the Server! 🎉

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Test the Full Workflow

1. **Browse products** on your localhost
2. **Add items to cart** (select a size)
3. **Click Checkout**
4. **Use Stripe test card**: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - Zip: Any 5 digits
5. **Complete payment**
6. **Watch your terminal** - you'll see:
   - ✅ Stripe webhook received
   - ✅ Order saved to database
   - ✅ Order submitted to Printify
7. **Check Printify Dashboard** - your test order should appear!

---

## ❓ Common Issues

### "Products not showing"
- Did you run `npm run sync-products`?
- Are products published in Printify?

### "Webhook not working"
- Is Stripe CLI running? (`stripe listen...`)
- Check your webhook secret in `.env.local`

### "Order not in Printify"
- Check terminal for errors
- Verify API token and Shop ID
- Make sure variant IDs match

---

## 📦 Project Structure

```
├── app/
│   ├── api/
│   │   ├── checkout/          ← Creates Stripe session
│   │   └── webhooks/stripe/   ← THE AUTOMATION MAGIC ✨
│   ├── page.tsx               ← Landing page
│   └── success/               ← Thank you page
├── components/                 ← UI components
├── lib/
│   ├── printify-service.ts    ← Printify API calls
│   └── sync-products.ts       ← Product sync script
└── store/
    └── cart-store.ts          ← Shopping cart state
```

---

## 🎯 The Key Automation File

The magic happens in: **`app/api/webhooks/stripe/route.ts`**

This file:
1. ✅ Receives Stripe payment confirmation
2. ✅ Extracts customer details
3. ✅ Saves order to database
4. ✅ Formats order for Printify API
5. ✅ Submits order automatically
6. ✅ Customer receives shipping notification

**You don't need to do anything manually!**

---

## 🚀 Going to Production

1. Deploy to Vercel (push to GitHub and import)
2. Add all environment variables in Vercel
3. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
4. Create production webhook in Stripe Dashboard:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Event: `checkout.session.completed`
5. Update `STRIPE_WEBHOOK_SECRET` in Vercel
6. Test with real (or test) payments!

---

Need help? Check the full [README.md](./README.md)

