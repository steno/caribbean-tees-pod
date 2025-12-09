# 🚀 Deploy to Netlify - Complete Guide

## 📋 Prerequisites

- [ ] GitHub account
- [ ] Netlify account (free tier available)
- [ ] Supabase project set up
- [ ] Stripe account (test mode is fine)
- [ ] Printify account with products

---

## 🎯 Quick Deployment (5 Minutes)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Caribbean Tees POD store"

# Create main branch
git branch -M main

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/caribbean-tees.git

# Push
git push -u origin main
```

### Step 2: Connect to Netlify

1. Go to [Netlify](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub**
4. Select your `caribbean-tees` repository
5. Netlify will auto-detect Next.js settings

### Step 3: Configure Build Settings

Netlify should auto-detect these, but verify:

- **Base directory**: (leave empty)
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Functions directory**: (auto-detected)

Click **"Show advanced"** and ensure:
- Node version: `18` or higher

### Step 4: Add Environment Variables

⚠️ **CRITICAL STEP** - Add these in Netlify Dashboard:

Go to: **Site settings** → **Environment variables** → **Add a variable**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Stripe (Use TEST keys first!)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # We'll get this in step 6

# Printify
PRINTIFY_API_TOKEN=eyJ0...
PRINTIFY_SHOP_ID=123456

# App URL (update after first deploy)
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

### Step 5: Deploy!

1. Click **"Deploy site"**
2. Wait 2-3 minutes for build to complete
3. Netlify will give you a URL like: `https://random-name-123.netlify.app`

### Step 6: Set Up Stripe Webhook

⚠️ **IMPORTANT** - This makes the automation work!

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter your Netlify URL:
   ```
   https://your-site.netlify.app/api/webhooks/stripe
   ```
4. Select event to listen to:
   - ✅ `checkout.session.completed`
5. Click **"Add endpoint"**
6. **Copy the Signing Secret** (starts with `whsec_...`)
7. Go back to Netlify → **Site settings** → **Environment variables**
8. Update `STRIPE_WEBHOOK_SECRET` with the new secret
9. **Trigger a redeploy**: **Deploys** → **Trigger deploy** → **Deploy site**

---

## 🎨 Custom Domain (Optional)

### Using Netlify Domain

1. Go to **Site settings** → **Domain management**
2. Click **"Options"** → **"Edit site name"**
3. Change from `random-name-123` to `caribbean-tees`
4. Your site will be: `https://caribbean-tees.netlify.app`

### Using Your Own Domain

1. Buy domain from Namecheap, GoDaddy, or Google Domains
2. Go to **Site settings** → **Domain management**
3. Click **"Add custom domain"**
4. Enter your domain: `caribbeantees.com`
5. Follow DNS configuration instructions
6. Netlify will auto-provision SSL certificate

**Important**: Update environment variables!
```env
NEXT_PUBLIC_APP_URL=https://caribbeantees.com
```

And update Stripe webhook URL to your custom domain.

---

## ✅ Post-Deployment Checklist

### Test Your Live Site

- [ ] Visit your Netlify URL
- [ ] Products display correctly
- [ ] Images load properly
- [ ] Can add items to cart
- [ ] Cart persists on page reload
- [ ] Checkout button works
- [ ] Mobile view looks good

### Test Payment Flow (Test Mode)

1. [ ] Click checkout
2. [ ] Use Stripe test card: `4242 4242 4242 4242`
3. [ ] Complete payment
4. [ ] Check Netlify Function logs (see below)
5. [ ] Verify order in Printify dashboard
6. [ ] Success page displays

### Check Function Logs

Go to: **Netlify Dashboard** → **Functions** → **api/webhooks/stripe**

You should see logs like:
```
✅ Stripe webhook received
✅ Order saved to database
✅ Printify order submitted
```

---

## 🔧 Netlify-Specific Configuration

### Functions (Serverless)

Next.js API routes automatically become Netlify Functions!

- `/api/checkout` → `/.netlify/functions/checkout`
- `/api/webhooks/stripe` → `/.netlify/functions/webhooks-stripe`

You don't need to configure anything - it just works! ✨

### Environment Variables

Access in Netlify:
- **Site settings** → **Environment variables**

Tips:
- Use different values for staging vs production
- Never commit secrets to git
- Redeploy after changing env vars

### Build Settings

Located in `netlify.toml` (already created):
- Build command
- Publish directory
- Redirects and headers
- Next.js plugin configuration

---

## 🐛 Troubleshooting

### Build Fails

**Error**: "Module not found"
**Solution**: 
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

**Error**: "Build exceeded maximum duration"
**Solution**: Netlify free tier has 300 min/month. Upgrade if needed.

### Functions Not Working

**Error**: 404 on `/api/checkout`
**Solution**: 
1. Check Netlify Functions tab - are they deployed?
2. Ensure Next.js version is 14.x
3. Check build logs for errors

### Webhook Not Firing

**Problem**: Orders not going to Printify

**Solution**:
1. Check Stripe webhook URL is correct (with `.netlify.app`)
2. Verify webhook secret in environment variables
3. Check Netlify Function logs for errors
4. Test webhook in Stripe dashboard

### Environment Variables Not Working

**Problem**: Can't connect to database/APIs

**Solution**:
1. Double-check all env vars are set in Netlify
2. Make sure there are no extra spaces
3. Redeploy after adding env vars
4. Check build logs for "undefined" errors

---

## 📊 Monitoring Your Store

### Netlify Analytics

Enable in: **Site settings** → **Analytics**
- Page views
- Unique visitors
- Top pages
- Traffic sources

### Function Logs

View in: **Functions** → **[Function name]** → **Function log**
- See all webhook calls
- Debug errors
- Monitor automation

### Stripe Dashboard

Monitor at: [dashboard.stripe.com](https://dashboard.stripe.com)
- Payment volume
- Failed payments
- Webhook delivery status

### Printify Dashboard

Check at: [printify.com/app/orders](https://printify.com/app/orders)
- Order status
- Production progress
- Shipping tracking

---

## 🚀 Going Live with Real Payments

### Switch from Test to Live Mode

1. **Get Stripe Live Keys**
   - [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Toggle from "Test" to "Live" mode
   - Copy live keys

2. **Update Netlify Environment Variables**
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   ```

3. **Create Live Webhook**
   - In Stripe **Live mode**, add webhook
   - URL: `https://your-site.netlify.app/api/webhooks/stripe`
   - Event: `checkout.session.completed`
   - Copy new live webhook secret

4. **Update Webhook Secret**
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_live_...
   ```

5. **Trigger Redeploy**
   - Netlify Dashboard → **Deploys** → **Trigger deploy**

6. **Test with Real Card**
   - Use your own card (small amount)
   - Verify order goes to Printify
   - ✅ You're live!

---

## 📈 Continuous Deployment

Every time you push to GitHub, Netlify automatically:
1. Detects the change
2. Runs build
3. Deploys new version
4. Keeps previous versions for rollback

### Deploy Preview (Staging)

Create a branch for testing:
```bash
git checkout -b feature/new-design
# Make changes
git push origin feature/new-design
```

Netlify creates a preview URL like:
`https://deploy-preview-123--your-site.netlify.app`

Test there before merging to main!

---

## 💰 Netlify Pricing

### Free Tier Includes:
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic HTTPS
- ✅ Unlimited sites
- ✅ Serverless functions (125k requests/month)

**Perfect for starting out!**

### When to Upgrade:
- High traffic (> 100GB/month)
- Many builds
- Need more function invocations
- Want custom analytics

---

## 🔐 Security Best Practices

### Webhook Security
- ✅ Always verify webhook signatures
- ✅ Use webhook secrets
- ✅ Check request source

### Environment Variables
- ✅ Never commit to git
- ✅ Use different keys for dev/prod
- ✅ Rotate secrets regularly

### HTTPS
- ✅ Netlify provides automatic HTTPS
- ✅ Forces redirect from HTTP to HTTPS
- ✅ Auto-renews SSL certificates

---

## 🎯 Performance Optimization

### Netlify Optimizations

Already enabled by default:
- Asset optimization (minification)
- Image optimization
- Brotli compression
- Global CDN

### Next.js Optimizations

Already configured:
- Static generation where possible
- Automatic code splitting
- Image optimization
- Font optimization

### Custom Optimizations

Optional improvements:
- Enable Netlify Image CDN
- Add Netlify Analytics
- Configure caching headers

---

## 📞 Getting Help

### Netlify Support
- Documentation: https://docs.netlify.com
- Community: https://answers.netlify.com
- Status: https://netlifystatus.com

### Build Issues
1. Check build logs in Netlify dashboard
2. Test build locally: `npm run build`
3. Check Node version matches

### Function Issues
1. View function logs in Netlify
2. Test locally with Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify dev
   ```

---

## ✨ Netlify-Specific Features

### Deploy Previews
- Every pull request gets a preview URL
- Test before merging

### Branch Deploys
- Deploy specific branches automatically
- Great for staging environments

### Rollback
- Instant rollback to previous deploy
- One-click in dashboard

### Split Testing
- A/B test different versions
- Built into Netlify (paid feature)

---

## 🎊 You're Live on Netlify!

Your automated POD store is now running on Netlify's global CDN!

### What Happens Now:

1. ✅ Customer visits your site
2. ✅ Adds products to cart
3. ✅ Completes Stripe checkout
4. ✅ Netlify Function receives webhook
5. ✅ Order auto-submits to Printify
6. ✅ Customer receives product

**100% automated!** 🎉

### Next Steps:

1. [ ] Test the full flow with a real order
2. [ ] Set up custom domain (optional)
3. [ ] Switch to Stripe live mode
4. [ ] Start marketing your store
5. [ ] Watch orders roll in! 💰

---

## 📋 Quick Reference

### Useful Commands

```bash
# Push updates to trigger deploy
git add .
git commit -m "Update products"
git push

# Install Netlify CLI
npm install -g netlify-cli

# Test locally with Netlify environment
netlify dev

# Link to existing site
netlify link

# View site in browser
netlify open
```

### Important URLs

- **Your site**: `https://your-site.netlify.app`
- **Netlify Dashboard**: https://app.netlify.com
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Printify Dashboard**: https://printify.com/app
- **Supabase Dashboard**: https://app.supabase.com

---

**Made with 🌴 for Netlify - Happy Selling!**

Need help? Check the main [README.md](./README.md) or [DEPLOYMENT.md](./DEPLOYMENT.md)

