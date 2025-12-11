# Easy Product Sync Guide

## 🚀 Quick Sync Methods

### Option 1: API Endpoint (Easiest for Automation)

You can now trigger a sync by calling this endpoint:

**Local:**
```bash
curl -X POST http://localhost:3000/api/sync \
  -H "Authorization: Bearer your-secret-token-here"
```

**Production (Netlify):**
```bash
curl -X POST https://costambar-tees.netlify.app/api/sync \
  -H "Authorization: Bearer your-secret-token-here"
```

**Add to `.env.local`:**
```bash
SYNC_SECRET=your-secret-token-here
```

### Option 2: GitHub Actions (Automatic Daily Sync)

Create `.github/workflows/sync-products.yml`:

```yaml
name: Sync Products Daily

on:
  schedule:
    - cron: '0 2 * * *' # Runs daily at 2 AM UTC
  workflow_dispatch: # Allows manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run sync-products
        env:
          PRINTIFY_API_TOKEN: ${{ secrets.PRINTIFY_API_TOKEN }}
          PRINTIFY_SHOP_ID: ${{ secrets.PRINTIFY_SHOP_ID }}
          FIREBASE_CLIENT_EMAIL: ${{ secrets.FIREBASE_CLIENT_EMAIL }}
          FIREBASE_PRIVATE_KEY: ${{ secrets.FIREBASE_PRIVATE_KEY }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_PROJECT_ID }}
```

### Option 3: Netlify Scheduled Functions

Create `netlify/functions/sync-products.ts`:

```typescript
import { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  // Call your sync API
  const response = await fetch(`${process.env.URL}/api/sync`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SYNC_SECRET}`
    }
  })
  
  return {
    statusCode: 200,
    body: JSON.stringify(await response.json())
  }
}
```

Then in `netlify.toml`:
```toml
[build]
  functions = "netlify/functions"

[[plugins]]
  package = "@netlify/plugin-scheduled-functions"
  [plugins.inputs]
    schedules = [
      { cron = "0 2 * * *", path = "/.netlify/functions/sync-products" }
    ]
```

### Option 4: Simple Bookmark (Browser)

Create a bookmark with this URL:
```
javascript:(function(){fetch('https://costambar-tees.netlify.app/api/sync',{method:'POST',headers:{'Authorization':'Bearer YOUR_SECRET'}}).then(r=>r.json()).then(alert)})()

```

### Option 5: Local Script (Quick Run)

Create `sync.sh`:
```bash
#!/bin/bash
cd /Users/stefanasemota/Documents/Costambar/~
npm run sync-products
```

Make it executable:
```bash
chmod +x sync.sh
```

Then just run: `./sync.sh`

---

## 📋 Recommended Setup

**For daily automatic sync:** Use GitHub Actions (Option 2)

**For manual sync when needed:** Use the API endpoint (Option 1) or local script (Option 5)

**For testing:** Use `npm run sync-products` locally

---

## 🔐 Security Note

Make sure to set `SYNC_SECRET` in your environment variables to protect the sync endpoint from unauthorized access.

