# Netlify Deployment Checklist

## ✅ Environment Variables Setup

Your site is deployed but products aren't loading because **environment variables are missing in Netlify**.

### How to Add Environment Variables in Netlify:
1. Go to your Netlify dashboard
2. Select your site: **caribbean-tees**
3. Navigate to: **Site configuration → Environment variables**
4. Click **"Add a variable"** for each one below

---

## Required Environment Variables

### 🔥 Firebase Client Config (Public - for client-side)
These are safe to expose publicly:

```
NEXT_PUBLIC_FIREBASE_API_KEY=<your-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-project-id>.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-project-id>.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-app-id>
```

**📍 Where to find these:**
- Copy from your local `.env.local` file
- OR get from Firebase Console → Project Settings → General → Your apps → SDK setup and configuration

---

### 🔒 Firebase Admin (Secret - for server-side)
**CRITICAL:** These load products on the server (ProductGrid component)

```
FIREBASE_CLIENT_EMAIL=<service-account-email>@<project-id>.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n<your-private-key>\n-----END PRIVATE KEY-----
```

**📍 Where to find these:**
- Copy from your local `.env.local` file
- OR regenerate from Firebase Console → Project Settings → Service Accounts → Generate new private key
- **IMPORTANT:** The private key must include the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` markers
- **NOTE:** Make sure to keep the `\n` characters in the private key (they represent line breaks)

---

### 💳 Stripe (for Payments)

```
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

**📍 Where to find these:**
- **STRIPE_SECRET_KEY**: Stripe Dashboard → Developers → API keys → Secret key
- **STRIPE_WEBHOOK_SECRET**: Stripe Dashboard → Developers → Webhooks → Add endpoint (use your Netlify URL + `/api/webhooks/stripe`)
- **NEXT_PUBLIC_APP_URL**: Your Netlify site URL (e.g., `https://costambar-tees.netlify.app`)

---

### 🖨️ Printify (for Order Fulfillment)

```
PRINTIFY_API_KEY=<your-printify-api-key>
PRINTIFY_SHOP_ID=<your-shop-id>
```

**📍 Where to find these:**
- Copy from your local `.env.local` file
- OR get from Printify Dashboard → Settings → API

---

## After Adding Environment Variables

### 1. Redeploy Your Site
After adding all environment variables:
- In Netlify dashboard, go to **Deploys**
- Click **"Trigger deploy"** → **"Deploy site"**

### 2. Sync Products to Firestore
After the site is redeployed with Firebase credentials, you need to add products:

**Option A: Run locally and sync to production Firebase**
```bash
npm run sync-products
```

**Option B: Add products manually via Firebase Console**
- Go to Firebase Console → Firestore Database
- Add products and variants collections

### 3. Verify Everything Works
- ✅ Visit your Netlify site
- ✅ Products should now be visible on homepage
- ✅ Test "Add to Cart" functionality
- ✅ Test checkout flow (use Stripe test card: `4242 4242 4242 4242`)

---

## Troubleshooting

### Products Still Not Loading?
1. Check Netlify deploy logs for errors
2. Verify all Firebase environment variables are set correctly
3. Make sure you redeployed after adding variables
4. Check that products exist in Firestore database

### Checkout Not Working?
1. Verify `STRIPE_SECRET_KEY` is set
2. Verify `NEXT_PUBLIC_APP_URL` matches your Netlify URL
3. Set up Stripe webhook endpoint

### Orders Not Submitting to Printify?
1. Verify `PRINTIFY_API_KEY` and `PRINTIFY_SHOP_ID` are set
2. Check `STRIPE_WEBHOOK_SECRET` is configured correctly
3. Test webhook locally first: https://stripe.com/docs/webhooks/test

---

## Security Notes

⚠️ **NEVER commit these to Git:**
- `STRIPE_SECRET_KEY`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- `PRINTIFY_API_KEY`
- `STRIPE_WEBHOOK_SECRET`

✅ These are safe to commit (already in your code):
- All `NEXT_PUBLIC_*` variables
- They're visible in browser anyway

---

## Quick Copy Template

Copy your values from `.env.local` and paste into Netlify:

```bash
# Get all your env vars at once (run this locally)
cat .env.local
```

Then add each one to Netlify's environment variables UI.

---

## Next Steps After Products Load

1. **Add a favicon** to fix the 404:
   - Create `public/favicon.ico` file
   - Or add `<link rel="icon" href="/favicon.ico">` to your layout

2. **Set up Stripe Webhook**:
   - Stripe Dashboard → Webhooks → Add endpoint
   - URL: `https://your-site.netlify.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

3. **Test Full Order Flow**:
   - Add product to cart
   - Complete checkout with test card
   - Verify order appears in Firestore
   - Check that order was sent to Printify

---

## Need Help?

If products still don't load after following all steps:
1. Check Netlify function logs
2. Check browser console for errors
3. Verify Firestore has products in the `products` collection
