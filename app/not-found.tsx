import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Beach 404 Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/404-beach.gif')",
        }}
      >
        {/* Overlay for better text readability if needed */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 max-w-md mx-auto">
          <h1 className="text-6xl font-extrabold text-ocean-600 mb-4">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Oops! The page you&apos;re looking for has drifted away like a message in a bottle...
          </p>
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-ocean-600 to-ocean-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-ocean-700 hover:to-ocean-600 transition-all shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Back to Shore
          </Link>
        </div>
      </div>
    </div>
  )
}
