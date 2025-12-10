import type { Metadata } from 'next'
import { Anybody } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { CartSlideOver } from '@/components/CartSlideOver'

const anybody = Anybody({ 
  subsets: ['latin'],
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
      <body className={anybody.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <CartSlideOver />
        <footer className="bg-ocean-900 text-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-ocean-200">
              © {new Date().getFullYear()} Costambar Tees. Made with 🌴 for the islands.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}

