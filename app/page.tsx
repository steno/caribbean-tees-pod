import { ProductGrid } from '@/components/ProductGrid'
import { Waves, Palmtree, Ship } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Beach Theme */}
      <section className="relative bg-gradient-to-br from-ocean-400 via-ocean-500 to-ocean-600 text-white overflow-hidden">
        {/* Decorative waves */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="absolute bottom-0 w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="currentColor"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Decorative icons */}
            <div className="flex justify-center gap-8 mb-6">
              <Palmtree className="w-12 h-12 text-palm-300 animate-bounce" style={{ animationDelay: '0s' }} />
              <Waves className="w-12 h-12 text-ocean-200 animate-bounce" style={{ animationDelay: '0.2s' }} />
              <Ship className="w-12 h-12 text-sand-200 animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight">
              Caribbean Tees
            </h1>
            <p className="text-xl md:text-2xl text-ocean-50 mb-8 max-w-3xl mx-auto">
              Bring the island vibes to your wardrobe. Premium quality tees with beach and Caribbean themes, 
              printed on-demand and shipped worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 inline-flex items-center gap-2">
                <span className="text-2xl">🌴</span>
                <span className="text-sm">Island Designs</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 inline-flex items-center gap-2">
                <span className="text-2xl">🚚</span>
                <span className="text-sm">Free Shipping Over $50</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 inline-flex items-center gap-2">
                <span className="text-2xl">♻️</span>
                <span className="text-sm">Eco-Friendly Printing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto"
          >
            <path
              fill="#fdfcfb"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Shop Our Collection
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Each design is carefully crafted and printed fresh when you order. 
            Choose your favorite size and we'll handle the rest!
          </p>
        </div>

        <ProductGrid />
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-sand-100 to-coral-50 py-16 mt-20">
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
                Original Caribbean-inspired artwork you won't find anywhere else
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

