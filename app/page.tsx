import { ProductGrid } from '@/components/ProductGrid'
import { ExpandableAbout } from '@/components/ExpandableAbout'
import { AutoScroll } from '@/components/AutoScroll'
import { Palette, Shirt, Globe } from 'lucide-react'

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <AutoScroll />
      {/* Hero Section - Sticky Background */}
      <section className="sticky top-16 md:top-0 overflow-hidden -z-10 h-[calc(75vh-64px)] md:h-[calc(70vh-100px)]">
        {/* Background GIF - Scales responsively */}
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat bg-[center_top] md:bg-[center_calc(50%+20px)]"
          style={{
            backgroundImage: "url('/home-photo.jpg')",
          }}
        />
      </section>

      {/* Products Section - Scrolls over hero */}
      <section 
        aria-labelledby="products-heading"
        className="relative bg-white rounded-t-[5.5rem] -mt-20 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 id="products-heading" className="sr-only">
            Caribbean-Inspired T-Shirts Collection
          </h2>
          <div className="text-center mb-8">
            {/* Expandable About Section for SEO */}
            <ExpandableAbout />
          </div>

          <ProductGrid />
        </div>
      </section>

      {/* Features Section */}
      <section 
        aria-labelledby="features-heading"
        className="relative bg-gradient-to-br from-sand-100 to-coral-50 py-16"
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Unique Designs
              </h3>
              <p className="text-gray-600">
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Premium Quality
              </h3>
              <p className="text-gray-600">
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Worldwide Shipping
              </h3>
              <p className="text-gray-600">
                Printed locally and shipped directly to your door
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}

