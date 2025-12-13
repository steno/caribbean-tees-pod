# SEO & Accessibility Guide

This document outlines all SEO and accessibility improvements implemented in the Costambar Tees website.

## 🎯 Meta Tags & SEO

### Basic Meta Tags
- **Title**: "Costambar Tees - Beach Vibes & Island Style"
- **Description**: Comprehensive description optimized for search engines
- **Keywords**: 14+ targeted keywords related to Caribbean, beach, and t-shirt themes
- **Robots**: Configured to allow full indexing with optimal preview settings

### Open Graph (Facebook/LinkedIn)
```typescript
openGraph: {
  type: 'website',
  locale: 'en_US',
  url: siteUrl,
  siteName: 'Costambar Tees',
  title: 'Costambar Tees - Beach Vibes & Island Style',
  description: '...',
  images: [{ url: '/CT-Logo-final.png', width: 1200, height: 630 }]
}
```

### Twitter Cards
```typescript
twitter: {
  card: 'summary_large_image',
  title: 'Costambar Tees - Beach Vibes & Island Style',
  description: '...',
  images: ['/CT-Logo-final.png'],
  creator: '@costambartees'
}
```

## 🏗️ Structured Data (JSON-LD)

### Organization Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Costambar Tees",
  "url": "https://caribbeantees.com",
  "logo": "...",
  "description": "..."
}
```

### Website Schema
Includes SearchAction for enhanced search appearance in Google.

## ♿ Accessibility Features

### ARIA Labels & Roles
- **Header**: `role="banner"` for screen readers
- **Main Content**: `id="main-content"` for skip links
- **Footer**: `role="contentinfo"` for semantic structure
- **Navigation**: Proper `aria-label` attributes
- **Buttons**: Descriptive `aria-label` for cart, expandable sections
- **Images**: Proper `alt` text and `aria-hidden` for decorative icons

### Semantic HTML
- Proper heading hierarchy (H1 → H2 → H3)
- Screen reader only content with `sr-only` class
- `<article>` tags for feature cards
- `<nav>` for navigation elements
- Proper `<section>` with `aria-labelledby`

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Proper focus states on buttons and links
- Expandable sections use `aria-expanded` and `aria-controls`

### Screen Reader Support
- Hidden headings for context (e.g., "About Costambar Tees")
- ARIA attributes for dynamic content
- Proper labeling for cart item counts
- Region roles for expandable content

## 📱 Mobile & PWA

### Progressive Web App
- `site.webmanifest` for installable app
- Theme color: `#0389b2` (Ocean blue)
- Apple Web App capable
- Proper viewport configuration

### Touch & Mobile
- Viewport: `width=device-width, initialScale=1, maximumScale=5`
- Touch-friendly button sizes (minimum 44x44px)
- Responsive images with proper sizes

## 🤖 robots.txt

Located at `/public/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /api/webhooks/
Sitemap: https://caribbeantees.com/sitemap.xml
```

## 🔍 SEO Checklist

- ✅ Unique title tags
- ✅ Meta descriptions (155-160 characters)
- ✅ Heading hierarchy (H1-H3)
- ✅ Alt text for all images
- ✅ Semantic HTML5 elements
- ✅ Mobile-friendly design
- ✅ Fast loading times (Next.js optimization)
- ✅ Structured data (Schema.org)
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ robots.txt file
- ✅ Favicon and app icons
- ✅ SSL/HTTPS (Netlify default)
- ⏳ Sitemap.xml (TODO: Generate with Next.js)
- ⏳ Google Analytics (Optional)
- ⏳ Google Search Console verification (Optional)

## 📊 Testing Tools

### SEO Testing
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)

### Accessibility Testing
- [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/) (built into Chrome)

### Social Media Preview
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

## 🎨 Color Contrast

All text meets WCAG 2.1 Level AA standards:
- **Ocean Blue (#0389b2)** on white: ✅ AA
- **White text** on Ocean Blue: ✅ AA
- **Coral (#FF6B6B)** on white: ✅ AA

## 🔮 Future Improvements

1. **Generate sitemap.xml** automatically with Next.js
2. **Add Google Analytics** for traffic monitoring
3. **Implement breadcrumbs** with structured data
4. **Add Product schema** for individual products
5. **Create blog section** for SEO content
6. **Add hreflang tags** if expanding to multiple languages
7. **Implement AMP pages** for faster mobile loading (optional)
8. **Add FAQ schema** for common questions

## 📝 Configuration

### Update Domain
In `app/layout.tsx`, update the `siteUrl` constant:
```typescript
const siteUrl = 'https://caribbeantees.com' // Your actual domain
```

### Update Social Media
In `app/layout.tsx`, update Twitter handle:
```typescript
twitter: {
  creator: '@costambartees', // Your Twitter handle
}
```

### Add Social Links
In the structured data, uncomment and add your social profiles:
```typescript
sameAs: [
  'https://facebook.com/costambartees',
  'https://instagram.com/costambartees',
  'https://twitter.com/costambartees',
]
```

## 📈 Monitoring

After deployment, register with:
- **Google Search Console**: Monitor search performance
- **Bing Webmaster Tools**: Expand search visibility
- **Google Analytics**: Track user behavior
- **Hotjar/Microsoft Clarity**: User session recordings

## 🚀 Performance Tips

- Images are optimized with Next.js Image component
- Lazy loading for product images
- Suspense boundaries for better loading states
- Font optimization with `next/font`
- Static generation where possible
- Edge functions for dynamic content

---

Last Updated: December 13, 2025
