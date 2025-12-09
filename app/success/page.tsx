import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 to-ocean-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Confirmed! 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your order has been automatically sent to our print partner 
          and will be processed shortly.
        </p>

        <div className="bg-ocean-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-ocean-900">
            <strong>What happens next?</strong>
          </p>
          <ul className="text-sm text-ocean-800 mt-2 space-y-1 text-left">
            <li>✓ Your order is being printed</li>
            <li>✓ You&apos;ll receive a shipping notification via email</li>
            <li>✓ Track your package all the way to your door</li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-ocean-600 to-ocean-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-ocean-700 hover:to-ocean-600 transition-all shadow-md hover:shadow-lg"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

