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

export const metadata: Metadata = {
  title: 'Costambar Tees - Beach Vibes & Island Style',
  description: 'Premium print-on-demand t-shirts with Costambar and beach themes. Order custom printed shirts delivered to your door.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head></head>
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

