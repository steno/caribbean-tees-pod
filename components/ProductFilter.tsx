'use client'

import { useState } from 'react'

export type GenderFilter = 'all' | 'men' | 'women'
export type SortOption = 'random' | 'price-low' | 'price-high' | 'newest' | 'oldest'

interface ProductFilterProps {
  onFilterChange: (filter: GenderFilter) => void
  activeFilter: GenderFilter
  onSortChange: (sort: SortOption) => void
  activeSort: SortOption
}

export function ProductFilter({ onFilterChange, activeFilter, onSortChange, activeSort }: ProductFilterProps) {
  return (
    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center mb-8 gap-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-ocean-600 text-white shadow-lg'
              : 'bg-white text-gray-700 border-2 border-sand-200 hover:border-ocean-300 hover:bg-ocean-50'
          }`}
        >
          All Products
        </button>
        <button
          onClick={() => onFilterChange('men')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            activeFilter === 'men'
              ? 'bg-ocean-600 text-white shadow-lg'
              : 'bg-white text-gray-700 border-2 border-sand-200 hover:border-ocean-300 hover:bg-ocean-50'
          }`}
        >
          Men&apos;s
        </button>
        <button
          onClick={() => onFilterChange('women')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            activeFilter === 'women'
              ? 'bg-ocean-600 text-white shadow-lg'
              : 'bg-white text-gray-700 border-2 border-sand-200 hover:border-ocean-300 hover:bg-ocean-50'
          }`}
        >
          Women&apos;s
        </button>
      </div>
      <div className="flex items-center gap-2">
        <select
          id="sort-select"
          value={activeSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-4 py-2 rounded-full text-sm font-medium bg-ocean-600 text-white shadow-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-ocean-300 appearance-none pr-8"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '12px'
          }}
        >
          <option value="random">Random</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
    </div>
  )
}

