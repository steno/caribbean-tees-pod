'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export function ExpandableAbout() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 text-ocean-600 hover:text-ocean-700 font-medium transition-colors"
        aria-expanded={isOpen}
      >
        <span>About Our Tees</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      
      {isOpen && (
        <div className="mt-4 text-gray-700 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-xl">
            Bring the island vibes to your wardrobe
          </p>
          <p className="text-base">
            Each design is carefully crafted and printed fresh when you order. 
            Premium quality tees with beach and Costambar themes, printed on-demand 
            and shipped worldwide. Choose your favorite size and we&apos;ll handle the rest!
          </p>
        </div>
      )}
    </div>
  )
}


