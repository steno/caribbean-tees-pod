import type { Metadata } from 'next'
import { Anybody } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { Header } from '@/components/Header'
import { CartSlideOver } from '@/components/CartSlideOver'

const anybody = Anybody({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-anybody',
})

const siteUrl = 'https://caribbeantees.com' // Update with your actual domain
const siteName = 'Costambar Tees'
const siteDescription = 'Discover premium Caribbean-inspired t-shirts with unique Costambar designs. High-quality print-on-demand apparel featuring beach vibes and island style. Worldwide shipping available.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Costambar Tees - Beach Vibes & Island Style',
    template: '%s | Costambar Tees',
  },
  description: siteDescription,
  keywords: [
    'Costambar',
    'Caribbean t-shirts',
    'beach tees',
    'island apparel',
    'tropical clothing',
    'vacation shirts',
    'Dominican Republic',
    'beach wear',
    'resort wear',
    'custom t-shirts',
    'print on demand',
    'unique designs',
    'Caribbean fashion',
    'beach lifestyle',
  ],
  authors: [{ name: 'Costambar Tees' }],
  creator: 'Costambar Tees',
  publisher: 'Costambar Tees',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/CT-Logo-final.png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: siteName,
    title: 'Costambar Tees - Beach Vibes & Island Style',
    description: siteDescription,
    images: [
      {
        url: '/CT-Logo-final.png',
        width: 1200,
        height: 630,
        alt: 'Costambar Tees - Caribbean Inspired T-Shirts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Costambar Tees - Beach Vibes & Island Style',
    description: siteDescription,
    images: ['/CT-Logo-final.png'],
    creator: '@costambartees', // Update with your actual Twitter handle
  },
  themeColor: '#0389b2',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Costambar Tees',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'shopping',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Structured Data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/CT-Logo-final.png`,
    description: siteDescription,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    sameAs: [
      // Add your social media profiles here when available
      // 'https://facebook.com/costambartees',
      // 'https://instagram.com/costambartees',
      // 'https://twitter.com/costambartees',
    ],
  }

  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
      </head>
      <body className={anybody.className}>
        <Header />
        <main className="min-h-screen" id="main-content">
          {children}
        </main>
        <CartSlideOver />
        <footer className="bg-[#217ba1] text-white py-12" role="contentinfo">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-4">
              <Link href="/privacy" className="text-ocean-200 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <span className="text-ocean-400 hidden md:inline">•</span>
              <Link href="/terms" className="text-ocean-200 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
            <p className="text-ocean-200 text-center text-sm">
              © {new Date().getFullYear()} Costambar Tees. Made with 🤍 for Costambar.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}

