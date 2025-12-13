import { Loader2 } from 'lucide-react'

export function ProductGridLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="w-12 h-12 text-ocean-600 animate-spin mb-4" />
      <p className="text-gray-600 text-sm">Loading products...</p>
    </div>
  )
}



