# 🔥 Firebase Setup Guide

Complete guide to setting up Firebase for your Caribbean Tees store.

---

## 📋 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Project name: `caribbean-tees` (or your choice)
4. Enable Google Analytics (optional)
5. Click **"Create project"**

---

## 🔑 Step 2: Get Firebase Credentials

### Web App Credentials

1. In Firebase Console, click the **⚙️ gear icon** → **Project settings**
2. Scroll down to **"Your apps"**
3. Click **"Web"** icon (`</>`)
4. App nickname: `caribbean-tees-web`
5. Click **"Register app"**
6. Copy the `firebaseConfig` object

You'll see something like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "caribbean-tees.firebaseapp.com",
  projectId: "caribbean-tees",
  storageBucket: "caribbean-tees.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
}
```

### Service Account (for Server-Side)

1. Go to **Project settings** → **Service accounts**
2. Click **"Generate new private key"**
3. Click **"Generate key"** (downloads a JSON file)
4. **Keep this file secure!** Never commit it to git

---

## 🗄️ Step 3: Enable Firestore Database

1. In Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Production mode"** (we'll add security rules)
4. Select location (choose closest to your users)
5. Click **"Enable"**

### Set Security Rules

1. Go to **Firestore Database** → **Rules** tab
2. Copy the contents from `firebase/firestore.rules` in your project
3. Paste into the Firebase Console
4. Click **"Publish"**

The rules allow:
- ✅ Public read access to products (for the website)
- ❌ No public write access (only via admin SDK)
- ❌ No access to orders (private data)

---

## ⚙️ Step 4: Configure Environment Variables

Create `.env.local` in your project root:

```env
# Firebase Web App Config (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Firebase Admin (Server-Side) - KEEP SECRET!
# Option 1: Full service account JSON (one line)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project",...}

# Option 2: Individual fields (recommended for Netlify/Vercel)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Printify
PRINTIFY_API_TOKEN=your_printify_api_token
PRINTIFY_SHOP_ID=your_shop_id

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Important Notes:

- **Public keys** (`NEXT_PUBLIC_*`) are safe to expose
- **Private keys** (`FIREBASE_SERVICE_ACCOUNT_KEY`, `FIREBASE_PRIVATE_KEY`) must be kept secret!
- Never commit `.env.local` to git (already in `.gitignore`)

---

## 📊 Step 5: Understand Firestore Structure

### Collections & Documents

Firebase uses a NoSQL document database called Firestore:

```
🗂️ products (collection)
  └── 📄 {productId} (document)
      ├── printify_product_id: "123"
      ├── title: "Beach Vibes Tee"
      ├── description: "..."
      ├── main_image_url: "https://..."
      ├── created_at: "2024-01-01T00:00:00Z"
      ├── updated_at: "2024-01-01T00:00:00Z"
      └── 🗂️ variants (subcollection)
          └── 📄 {variantId} (document)
              ├── printify_variant_id: 456
              ├── title: "Size M"
              ├── price: 2500 (cents)
              ├── is_available: true
              └── updated_at: "2024-01-01T00:00:00Z"

🗂️ orders (collection)
  └── 📄 {orderId} (document)
      ├── stripe_session_id: "cs_test_..."
      ├── printify_order_id: "12345"
      ├── customer_email: "customer@example.com"
      ├── customer_name: "John Doe"
      ├── shipping_address: {...}
      ├── total_amount: 2500
      ├── status: "submitted_to_printify"
      ├── line_items: [...]
      ├── created_at: "2024-01-01T00:00:00Z"
      └── updated_at: "2024-01-01T00:00:00Z"
```

---

## 🔄 Step 6: Sync Products from Printify

Run the sync script to import products:

```bash
npm run sync-products
```

This will:
1. Fetch all products from Printify API
2. Create documents in `products` collection
3. Create variant documents in each product's `variants` subcollection

**Run this anytime you add/update products in Printify!**

---

## 🧪 Step 7: Verify Setup

### Check Firestore Data

1. Go to Firebase Console → **Firestore Database**
2. You should see:
   - `products` collection with your synced products
   - Each product has a `variants` subcollection

### Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 - you should see your products!

---

## 🚀 Step 8: Deploy to Netlify

### Add Environment Variables in Netlify

Go to: **Site settings** → **Environment variables**

Add all variables from your `.env.local`:

**Important for Private Key:**
```env
# If using FIREBASE_PRIVATE_KEY, keep the quotes and \n
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADA...\n-----END PRIVATE KEY-----\n"
```

### Deploy

1. Push to GitHub (already done!)
2. Import to Netlify
3. Add environment variables
4. Deploy!

---

## 🔐 Security Best Practices

### ✅ DO:
- Keep service account JSON secure
- Use environment variables for all secrets
- Set proper Firestore security rules
- Rotate keys if compromised

### ❌ DON'T:
- Commit `.env.local` to git
- Share service account keys publicly
- Allow public write access to Firestore
- Hardcode credentials in code

---

## 📱 Firestore Console Tips

### View Data
Firebase Console → **Firestore Database** → Click collections

### Query Data
Use the **Filters** feature to search documents

### Delete Data
Click on a document → **Delete document**

### Monitor Usage
**Firestore Database** → **Usage** tab

Shows:
- Document reads/writes
- Storage used
- Network egress

---

## 💰 Firebase Pricing

### Free Tier (Spark Plan)

Generous free limits:
- ✅ 1 GB storage
- ✅ 10 GB/month transfer
- ✅ 50K reads/day
- ✅ 20K writes/day
- ✅ 20K deletes/day

**Perfect for starting out!**

### When to Upgrade

Upgrade to **Blaze** (pay-as-you-go) when:
- More than 50K product views/day
- More than 20K orders/day (you wish! 🎉)
- Need more storage

Pricing is very reasonable for small stores.

---

## 🔧 Troubleshooting

### "Permission denied" errors

**Problem**: Can't read/write to Firestore

**Solution**:
1. Check Firestore security rules are published
2. Verify products collection has read access
3. Ensure server-side code uses admin SDK

### Products not showing

**Problem**: No products on website

**Solution**:
1. Run `npm run sync-products`
2. Check Firebase Console for products
3. Verify environment variables are set

### Admin SDK errors

**Problem**: "Failed to initialize Firebase Admin"

**Solution**:
1. Check service account key is valid JSON
2. Verify `FIREBASE_PRIVATE_KEY` includes `\n` characters
3. Ensure project ID matches

### Sync script fails

**Problem**: Can't connect to Firebase

**Solution**:
1. Verify `.env.local` exists
2. Check service account credentials
3. Ensure Firestore is enabled

---

## 🎓 Learn More

### Official Docs
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

### Video Tutorials
- [Firebase for Beginners](https://www.youtube.com/watch?v=q5J5ho7YUhA)
- [Firestore Tutorial](https://www.youtube.com/watch?v=v_hR4K4auoQ)

---

## ✨ Advantages of Firebase

### vs Supabase/PostgreSQL

**Firebase Firestore:**
- ✅ NoSQL - flexible schema
- ✅ Real-time updates built-in
- ✅ Offline support
- ✅ Auto-scaling
- ✅ No connection pooling needed
- ✅ Simpler queries for nested data

**Trade-offs:**
- ❌ No complex SQL joins
- ❌ Different pricing model
- ❌ Vendor lock-in (Google)

**For this POD store:** Firebase is perfect! We don't need complex queries, and the real-time features are great for future enhancements.

---

## 🎊 You're Ready!

Your Firebase setup is complete!

### What Works:
- ✅ Product sync from Printify
- ✅ Products displayed on website
- ✅ Orders saved to Firestore
- ✅ Automatic Printify fulfillment
- ✅ Secure admin operations

### Test the Flow:
1. Browse products
2. Add to cart
3. Checkout (test card: 4242 4242 4242 4242)
4. Order automatically goes to Printify
5. Check Firebase Console → orders collection

---

**Made with 🔥 and 🌴 - Happy Selling!**

