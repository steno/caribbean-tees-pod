# Facebook Sharing Fix Guide

## What Was Fixed

1. ✅ **Corrected Domain**: Changed from `caribbeantees.com` to `costambar-tees.netlify.app`
2. ✅ **Optimized OG Image**: Created `og-image.jpg` (1200x630px) from beach photo
3. ✅ **Proper Image Type**: Added MIME type `image/jpeg` for better compatibility

## Clear Facebook's Cache

Facebook caches previews for 24-48 hours. To see your new image immediately:

### Method 1: Facebook Sharing Debugger (Recommended)

1. Go to: **https://developers.facebook.com/tools/debug/**
2. Paste your URL: `https://costambar-tees.netlify.app/`
3. Click **"Debug"**
4. Click **"Scrape Again"** button to refresh the cache
5. You should now see your beach photo preview!

### Method 2: Add URL Parameter

When sharing, add `?v=1` to force a new preview:
- `https://costambar-tees.netlify.app/?v=1`

Change the number each time you need to refresh (v=2, v=3, etc.)

## Testing Social Media Previews

### Facebook
- **Debugger**: https://developers.facebook.com/tools/debug/
- Shows exactly what Facebook will display

### Twitter/X
- **Card Validator**: https://cards-dev.twitter.com/validator
- Test your Twitter card appearance

### LinkedIn
- **Post Inspector**: https://www.linkedin.com/post-inspector/
- Check LinkedIn preview

### General Preview Tool
- **Social Share Preview**: https://socialsharepreview.com/
- See all platforms at once

## Your OG Image

The new Open Graph image is located at:
- **File**: `/public/og-image.jpg`
- **Dimensions**: 1200 x 630 pixels (Facebook's recommended size)
- **URL**: `https://costambar-tees.netlify.app/og-image.jpg`

### Recommended Sizes for Social Media

| Platform | Recommended Size | Aspect Ratio |
|----------|------------------|--------------|
| Facebook | 1200 x 630 px | 1.91:1 |
| Twitter | 1200 x 675 px | 16:9 |
| LinkedIn | 1200 x 627 px | 1.91:1 |
| Instagram | 1080 x 1080 px | 1:1 |

Our `og-image.jpg` works perfectly for Facebook, Twitter, and LinkedIn!

## Troubleshooting

### Still seeing old preview?

1. **Clear browser cache**: Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. **Use incognito/private mode**: Test in a fresh browser session
3. **Wait 30 minutes**: Facebook's cache can take time to update
4. **Add query parameter**: Use `?v=2` at the end of your URL

### Image not showing at all?

1. ✅ Check image is accessible: Visit `https://costambar-tees.netlify.app/og-image.jpg` directly
2. ✅ Verify it's a valid JPEG
3. ✅ File size should be under 8MB (ours is optimized)
4. ✅ Must be publicly accessible (no login required)

### Preview shows wrong content?

- Use the Facebook Debugger to see specific errors
- Check that your metadata in `app/layout.tsx` is correct
- Verify the domain matches your actual site

## Best Practices

1. **Update image**: Replace `public/og-image.jpg` with any photo
2. **Keep dimensions**: Always use 1200x630px for best compatibility
3. **File size**: Keep under 1MB for fast loading (ours is optimized)
4. **Clear cache**: Always use debugger after making changes
5. **Alt text**: Update the `alt` attribute in `layout.tsx` if you change the image

## Example Share Text

When sharing your site, use engaging text like:

> 🏝️ Bring Costambar vibes to your wardrobe! Premium Caribbean-inspired tees with unique designs. Worldwide shipping available! 
> https://costambar-tees.netlify.app/

## Custom Domain Note

When you connect a custom domain (like caribbeantees.com):

1. Update `siteUrl` in `app/layout.tsx`
2. Update robots.txt sitemap URL
3. Re-run Facebook Debugger with new domain
4. Update DNS settings with your domain provider

---

**Need to regenerate the OG image?**

```bash
magick public/home-photo.jpg -resize "1200x630^" -gravity center -extent 1200x630 public/og-image.jpg
```

Replace `home-photo.jpg` with any image you want to use!
