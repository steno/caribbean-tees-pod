# Favicon & Icon Assets

All favicon and icon assets have been generated from `public/CT-Logo-final.png`.

## Created Assets

### Favicons
- `favicon.ico` - Multi-size .ico file (16x16, 32x32, 48x48) - Classic browser favicon
- `favicon-16x16.png` - 16x16 PNG favicon
- `favicon-32x32.png` - 32x32 PNG favicon

### Apple Touch Icons
- `apple-touch-icon.png` - 180x180 PNG - For iOS home screen, Safari pinned tabs

### Android Chrome Icons
- `android-chrome-192x192.png` - 192x192 PNG - For Android home screen
- `android-chrome-512x512.png` - 512x512 PNG - For Android splash screens

### Web App Manifest
- `site.webmanifest` - PWA manifest file with app metadata

## Implementation

All icons are automatically referenced in `app/layout.tsx` through Next.js metadata API:

```typescript
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#0389b2',
}
```

## Browser Support

- ✅ All modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ iOS Safari (home screen icons)
- ✅ Android Chrome (home screen icons)
- ✅ PWA support (installable web app)
- ✅ Browser tabs and bookmarks

## Regenerating Icons

If you need to regenerate these assets from a new logo:

```bash
# Using ImageMagick
convert public/CT-Logo-final.png -resize 16x16 public/favicon-16x16.png
convert public/CT-Logo-final.png -resize 32x32 public/favicon-32x32.png
convert public/CT-Logo-final.png -resize 180x180 public/apple-touch-icon.png
convert public/CT-Logo-final.png -resize 192x192 public/android-chrome-192x192.png
convert public/CT-Logo-final.png -resize 512x512 public/android-chrome-512x512.png
convert public/CT-Logo-final.png -define icon:auto-resize=16,32,48 public/favicon.ico
```

## Testing

After deployment, test your favicons at:
- https://realfavicongenerator.net/favicon_checker
- Check browser tab, bookmarks, and home screen on mobile devices
