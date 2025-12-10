import { ProductGrid } from '@/components/ProductGrid'
import { ExpandableAbout } from '@/components/ExpandableAbout'

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      {/* Hero Section - Sticky Background */}
      <section className="sticky top-0 overflow-hidden h-[70vh] md:h-[80vh] -z-10">
        {/* Background GIF - Fixed in place */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/home-bg.gif')",
          }}
        />
      </section>

      {/* Products Section - Scrolls over hero */}
      <section className="relative bg-white rounded-t-3xl -mt-20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          {/* Expandable About Section for SEO */}
          <ExpandableAbout />
        </div>

          <ProductGrid />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative bg-gradient-to-br from-sand-100 to-coral-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-ocean-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Unique Designs
              </h3>
              <p className="text-gray-600">
                Original Costambar-inspired artwork you won&apos;t find anywhere else
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👕</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Premium Quality
              </h3>
              <p className="text-gray-600">
                Soft, comfortable fabrics that feel as good as island breeze
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-palm-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Worldwide Shipping
              </h3>
              <p className="text-gray-600">
                Printed locally and shipped directly to your door
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

