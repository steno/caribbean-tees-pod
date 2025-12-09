# 🚀 Deployment Checklist

## Pre-Deployment

### ✅ 1. Test Locally First

- [ ] Products sync successfully from Printify
- [ ] Products display on homepage
- [ ] Can add items to cart
- [ ] Cart persists on page reload
- [ ] Checkout creates Stripe session
- [ ] Test payment with `4242 4242 4242 4242` works
- [ ] Webhook receives payment and creates order
- [ ] Order appears in Printify dashboard
- [ ] Success page displays after payment

### ✅ 2. Verify All Credentials

- [ ] Supabase URL and keys
- [ ] Stripe test keys work
- [ ] Printify API token valid
- [ ] All environment variables set

---

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Caribbean Tees POD store"
git branch -M main
git remote add origin https://github.com/yourusername/caribbean-tees.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### Step 3: Add Environment Variables

In Vercel project settings, add these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  ← Use LIVE keys!
STRIPE_SECRET_KEY=sk_live_...                    ← Use LIVE keys!
STRIPE_WEBHOOK_SECRET=whsec_...                  ← Get from Stripe (step 5)

PRINTIFY_API_TOKEN=eyJ0...
PRINTIFY_SHOP_ID=123456

NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

⚠️ **Important**: Use **LIVE** Stripe keys for production!

### Step 4: Deploy

Click **"Deploy"** and wait for build to complete.

### Step 5: Set Up Production Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter URL: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select event: `checkout.session.completed`
5. Click **"Add endpoint"**
6. **Copy the webhook secret** (`whsec_...`)
7. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`
8. Redeploy the app

---

## Post-Deployment Testing

### ✅ Critical Tests

1. **Visit your live site**
   - [ ] Products load correctly
   - [ ] Images display properly
   - [ ] Cart works
   - [ ] Mobile view looks good

2. **Test with Stripe Test Mode** (recommended first)
   - [ ] Use test keys temporarily
   - [ ] Complete a test order
   - [ ] Verify webhook works
   - [ ] Check order in Printify
   - [ ] Once confirmed, switch to live keys

3. **Test with Real Payment** (small amount)
   - [ ] Place a real order
   - [ ] Check Stripe Dashboard for payment
   - [ ] Verify order in Printify
   - [ ] Check customer receives confirmation

---

## Custom Domain (Optional)

### Step 1: Buy Domain
- Namecheap, GoDaddy, or Google Domains

### Step 2: Add to Vercel
1. Go to Vercel project > Settings > Domains
2. Add your domain (e.g., `caribbeantees.com`)
3. Follow DNS instructions

### Step 3: Update Environment Variables
```env
NEXT_PUBLIC_APP_URL=https://caribbeantees.com
```

### Step 4: Update Stripe Webhook
Update webhook URL to your custom domain.

---

## Monitoring & Maintenance

### Daily Checks
- [ ] Monitor Stripe Dashboard for new orders
- [ ] Check Printify for orders in production
- [ ] Review any error emails

### Weekly Tasks
- [ ] Sync new products: `npm run sync-products` (run locally, or set up cron)
- [ ] Review customer emails/issues
- [ ] Check Stripe for refund requests

### Monthly
- [ ] Review analytics (Vercel Analytics)
- [ ] Update product inventory in Printify
- [ ] Check for any failed webhooks in Stripe

---

## Troubleshooting Production Issues

### Orders Not Going to Printify

1. **Check Vercel Logs**
   ```
   Vercel Dashboard > Deployments > [Latest] > Functions > /api/webhooks/stripe
   ```

2. **Check Stripe Webhook**
   ```
   Stripe Dashboard > Webhooks > [Your endpoint] > Recent Deliveries
   ```
   - Look for `checkout.session.completed` events
   - Check response codes (should be 200)
   - View request/response data

3. **Verify Environment Variables**
   - All variables present in Vercel?
   - Printify credentials correct?
   - Webhook secret matches Stripe?

### Images Not Loading

- Check `next.config.js` has Printify domain
- Verify image URLs in database
- Re-sync products

### Webhook Failures

- Check webhook signature (signing secret)
- Verify endpoint URL is correct
- Look at error logs in Vercel

---

## Scaling Up

### When You're Getting Sales 🎉

1. **Set up Printify Auto-Approval**
   - Printify Dashboard > Settings
   - Enable "Auto-approve orders"
   - Orders go straight to production

2. **Monitor Inventory**
   - Some Printify products go out of stock
   - Run `npm run sync-products` regularly
   - Or build a cron job to auto-sync

3. **Add More Products**
   - Create new designs in Printify
   - Run sync script
   - Products appear automatically

4. **Marketing**
   - Share on social media
   - Run ads (Facebook, Instagram)
   - Email marketing
   - SEO optimization

---

## Security Best Practices

- [ ] Never commit `.env.local` to git
- [ ] Use environment variables for all secrets
- [ ] Keep Stripe keys secure
- [ ] Regularly rotate API tokens
- [ ] Monitor for unusual activity

---

## Support Resources

- **Stripe**: https://support.stripe.com
- **Printify**: https://help.printify.com
- **Supabase**: https://supabase.com/docs
- **Vercel**: https://vercel.com/docs
- **Next.js**: https://nextjs.org/docs

---

## 🎊 You're Ready!

Your automated Print-on-Demand store is live!

Every order will automatically:
1. ✅ Be received by Stripe
2. ✅ Trigger your webhook
3. ✅ Save to database
4. ✅ Submit to Printify
5. ✅ Get printed and shipped
6. ✅ Customer receives tracking

**You just handle marketing and customer service!**

Good luck with your Caribbean Tees store! 🌴👕

