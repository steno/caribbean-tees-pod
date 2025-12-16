import { Suspense } from 'react'
import { ProductGrid } from '@/components/ProductGrid'
import { ProductGridLoading } from '@/components/ProductGridLoading'
import { ExpandableAbout } from '@/components/ExpandableAbout'
import { RotatingHero } from '@/components/RotatingHero'
import { AutoScroll } from '@/components/AutoScroll'
import { Palette, Shirt, Globe } from 'lucide-react'

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <AutoScroll />
      {/* Hero Section - Rotating Background */}
      <RotatingHero />
      
      {/* Products Section - Scrolls over hero */}
      <section 
        aria-labelledby="products-heading"
        className="relative bg-white rounded-t-[2.5rem] md:rounded-t-[3.5rem] mt-[50vh] md:mt-[45vh] shadow-2xl"
        style={{
          border: '10px solid rgba(255, 255, 255, 0.5)',
          backgroundClip: 'padding-box',
          WebkitBackgroundClip: 'padding-box',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 id="products-heading" className="sr-only">
            Caribbean-Inspired T-Shirts Collection
          </h2>
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
        aria-labelledby="features-heading"
        className="relative py-16 bg-repeat md:bg-repeat-x"
        style={{
          backgroundImage: "url('/wood-bg.png')",
          backgroundSize: 'contain',
          boxShadow: 'inset 0 -15px 30px -10px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="features-heading" className="sr-only">
            Why Choose Costambar Tees
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="text-center group">
              <div 
                className="w-20 h-20 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300"
                aria-hidden="true"
              >
                <Palette className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-ocean-200 mb-2">
                Unique Designs
              </h3>
              <p className="text-ocean-100">
                Original Costambar-inspired artwork you won&apos;t find anywhere else
              </p>
            </article>

            <article className="text-center group">
              <div 
                className="w-20 h-20 bg-gradient-to-br from-coral-400 to-coral-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300"
                aria-hidden="true"
              >
                <Shirt className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-coral-200 mb-2">
                Premium Quality
              </h3>
              <p className="text-coral-100">
                Soft, comfortable fabrics that feel as good as island breeze
              </p>
            </article>

            <article className="text-center group">
              <div 
                className="w-20 h-20 bg-gradient-to-br from-palm-400 to-palm-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300"
                aria-hidden="true"
              >
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-palm-200 mb-2">
                Worldwide Shipping
              </h3>
              <p className="text-palm-100">
                Printed locally and shipped directly to your door
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}

