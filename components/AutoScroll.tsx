'use client'

import { useEffect } from 'react'

export function AutoScroll() {
  useEffect(() => {
    // Immediately scroll to top on page load/refresh
    window.scrollTo({ top: 0, behavior: 'instant' })

    // Wait 4 seconds after page load, then auto-scroll to products
    const timer = setTimeout(() => {
      const isMobile = window.innerWidth < 768
      const scrollOffset = isMobile 
        ? window.innerHeight * 0.75 // Mobile: calc(75vh-64px) hero height, scroll to end of hero
        : window.innerHeight * 0.5 + 69 // Desktop: original offset
      
      window.scrollTo({
        top: scrollOffset,
        behavior: 'smooth'
      })
    }, 4000) // 4 seconds delay

    return () => clearTimeout(timer)
  }, [])

  return null // This component doesn't render anything
}

