'use client'

import { useState } from 'react'

export type GenderFilter = 'all' | 'men' | 'women'

interface ProductFilterProps {
  onFilterChange: (filter: GenderFilter) => void
  activeFilter: GenderFilter
}

export function ProductFilter({ onFilterChange, activeFilter }: ProductFilterProps) {
  return (
    <div className="flex justify-center items-center gap-3 mb-8">
      <button
        onClick={() => onFilterChange('all')}
        className={`px-6 py-2 rounded-full font-semibold transition-all ${
          activeFilter === 'all'
            ? 'bg-ocean-600 text-white shadow-lg'
            : 'bg-white text-gray-700 border-2 border-sand-200 hover:border-ocean-300 hover:bg-ocean-50'
        }`}
      >
        All Products
      </button>
      <button
        onClick={() => onFilterChange('men')}
        className={`px-6 py-2 rounded-full font-semibold transition-all ${
          activeFilter === 'men'
            ? 'bg-ocean-600 text-white shadow-lg'
            : 'bg-white text-gray-700 border-2 border-sand-200 hover:border-ocean-300 hover:bg-ocean-50'
        }`}
      >
        Men&apos;s
      </button>
      <button
        onClick={() => onFilterChange('women')}
        className={`px-6 py-2 rounded-full font-semibold transition-all ${
          activeFilter === 'women'
            ? 'bg-ocean-600 text-white shadow-lg'
            : 'bg-white text-gray-700 border-2 border-sand-200 hover:border-ocean-300 hover:bg-ocean-50'
        }`}
      >
        Women&apos;s
      </button>
    </div>
  )
}
