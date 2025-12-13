import { Suspense } from 'react'
import { ProductGrid } from '@/components/ProductGrid'
import { ProductGridLoading } from '@/components/ProductGridLoading'
import { ExpandableAbout } from '@/components/ExpandableAbout'
import { RotatingHero } from '@/components/RotatingHero'
import { Palette, Shirt, Globe } from 'lucide-react'

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      {/* Hero Section - Rotating Background */}
      <RotatingHero />

      {/* Products Section - Scrolls over hero */}
      <section className="relative bg-white rounded-t-[2.5rem] md:rounded-t-[3.5rem] -mt-20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          {/* Expandable About Section for SEO */}
          <ExpandableAbout />
        </div>

          <Suspense fallback={<ProductGridLoading />}>
            <ProductGrid />
          </Suspense>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="relative py-16"
        style={{
          backgroundImage: "url('/wood-bg.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'repeat-x',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Palette className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-ocean-200 mb-2">
                Unique Designs
              </h3>
              <p className="text-ocean-100">
                Original Costambar-inspired artwork you won&apos;t find anywhere else
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-coral-400 to-coral-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Shirt className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-coral-200 mb-2">
                Premium Quality
              </h3>
              <p className="text-coral-100">
                Soft, comfortable fabrics that feel as good as island breeze
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-palm-400 to-palm-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-palm-200 mb-2">
                Worldwide Shipping
              </h3>
              <p className="text-palm-100">
                Printed locally and shipped directly to your door
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

