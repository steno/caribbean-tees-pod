# 🔥 Firebase Migration Complete!

## ✅ What Changed

Your Caribbean Tees store now uses **Firebase Firestore** instead of Supabase!

---

## 📦 New Dependencies

```json
"firebase": "^10.8.0",          // Client SDK
"firebase-admin": "^12.0.0"     // Server SDK (for API routes)
```

**Removed:**
- `@supabase/supabase-js`

---

## 🗂️ New Files

### Firebase Configuration
- ✅ `lib/firebase.ts` - Client-side Firebase config
- ✅ `lib/firebase-admin.ts` - Server-side Admin SDK
- ✅ `firebase/firestore.rules` - Security rules
- ✅ `firebase/firestore.indexes.json` - Index configuration
- ✅ `FIREBASE_SETUP.md` - Complete setup guide

### Updated Files
- ✅ `lib/sync-products.ts` - Now uses Firestore
- ✅ `app/api/webhooks/stripe/route.ts` - Saves orders to Firestore
- ✅ `components/ProductGrid.tsx` - Queries Firestore
- ✅ `package.json` - Firebase dependencies

### Deleted Files
- ❌ `lib/supabase.ts` (replaced by Firebase)
- ❌ `types/database.ts` (no longer needed)
- ❌ `supabase/schema.sql` (Firestore is NoSQL)

---

## 🔑 New Environment Variables

Replace your Supabase vars with Firebase:

### Remove These:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Add These:
```env
# Firebase Web Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin (pick one option)

# Option 1: Full service account JSON
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Option 2: Individual fields (better for Netlify)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## 🗄️ Database Structure

### Before (Supabase - PostgreSQL)
```sql
products (table)
├── id (UUID)
├── printify_product_id
├── title
└── ...

product_variants (table)
├── id (UUID)
├── product_id (foreign key)
├── printify_variant_id
└── ...
```

### After (Firebase - Firestore)
```
🗂️ products (collection)
  └── 📄 {printifyProductId} (document)
      ├── title
      ├── description
      └── 🗂️ variants (subcollection)
          └── 📄 {variantId} (document)
              ├── price
              └── title

🗂️ orders (collection)
  └── 📄 {orderId} (auto-generated)
      ├── stripe_session_id
      ├── printify_order_id
      └── ...
```

**Key Difference:** Variants are now a **subcollection** instead of a separate table with foreign keys!

---

## 🚀 Setup Steps

### 1. Create Firebase Project
```
https://console.firebase.google.com/
→ Create project
→ Enable Firestore
```

### 2. Get Credentials
- Web app config (Project Settings)
- Service account key (Service Accounts tab)

### 3. Update `.env.local`
Copy from `.env.local.example` or see `FIREBASE_SETUP.md`

### 4. Deploy Security Rules
Copy `firebase/firestore.rules` to Firebase Console

### 5. Sync Products
```bash
npm run sync-products
```

### 6. Test Locally
```bash
npm run dev
```

---

## 🎯 What Still Works

Everything! The automation is identical:

1. ✅ Customer browses products
2. ✅ Adds to cart (Zustand)
3. ✅ Checks out (Stripe)
4. ✅ Webhook receives payment
5. ✅ Order saved to Firestore (instead of Supabase)
6. ✅ Order submitted to Printify
7. ✅ Customer receives product

**The flow is the same, just different database!**

---

## 💡 Why Firebase?

### Advantages
- ✅ **Simpler setup** - No SQL schemas
- ✅ **Better for nested data** - Variants as subcollection
- ✅ **Real-time updates** - Built-in (for future features)
- ✅ **Generous free tier** - 50K reads/day
- ✅ **Auto-scaling** - No connection pool issues
- ✅ **Offline support** - Built-in for PWAs
- ✅ **Popular** - Huge community & tutorials

### Trade-offs
- ❌ No complex SQL queries (we don't need them)
- ❌ Google vendor lock-in
- ❌ Different pricing model (pay per operation)

**For a POD store:** Firebase is perfect! Simple data model, no complex queries needed.

---

## 🔄 Migration Checklist

If migrating from existing Supabase setup:

- [ ] Create Firebase project
- [ ] Enable Firestore
- [ ] Get credentials
- [ ] Update `.env.local`
- [ ] Deploy security rules
- [ ] Run `npm install` (new dependencies)
- [ ] Run `npm run sync-products`
- [ ] Test locally
- [ ] Update Netlify environment variables
- [ ] Deploy to Netlify
- [ ] Test production

---

## 📊 Code Changes Summary

### `lib/sync-products.ts`
**Before:**
```typescript
await supabase.from('products').upsert(...)
```

**After:**
```typescript
await db.collection('products').doc(id).set(...)
```

### `app/api/webhooks/stripe/route.ts`
**Before:**
```typescript
const { data } = await supabase.from('orders').insert(...)
```

**After:**
```typescript
const orderRef = db.collection('orders').doc()
await orderRef.set(...)
```

### `components/ProductGrid.tsx`
**Before:**
```typescript
const { data } = await supabase
  .from('products')
  .select('*, variants:product_variants(*)')
```

**After:**
```typescript
const products = await db.collection('products').get()
const variants = await productRef.collection('variants').get()
```

---

## 🧪 Testing

Same as before:

1. **Visit site** → Products should load
2. **Add to cart** → Cart works
3. **Checkout** → Use `4242 4242 4242 4242`
4. **Check Firebase Console** → Order appears in `orders` collection
5. **Check Printify** → Order submitted

---

## 📖 Documentation

- **`FIREBASE_SETUP.md`** - Complete Firebase setup guide
- **`README.md`** - Updated with Firebase instructions
- **`NETLIFY_DEPLOYMENT.md`** - Still applicable (just different env vars)

---

## ⚠️ Important Notes

### For Netlify Deployment

Use **Option 2** for environment variables:
```env
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Keep the quotes and `\n` characters!**

### Security

- Never commit service account JSON to git
- `.env.local` is already in `.gitignore`
- Firestore rules prevent unauthorized access

### Pricing

Monitor usage in Firebase Console:
- **Firestore Database** → **Usage** tab
- Free tier is generous
- Typical POD store stays under limits easily

---

## 🎊 You're All Set!

Firebase migration is complete!

### Next Steps:
1. Follow `FIREBASE_SETUP.md` for detailed setup
2. Sync products: `npm run sync-products`
3. Test locally: `npm run dev`
4. Deploy to Netlify with new env vars
5. Start selling! 🌴

---

**Made with 🔥 for Firebase - Happy Selling!**

