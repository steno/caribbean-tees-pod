'use client'

import { useEffect } from 'react'

export function AutoScroll() {
  useEffect(() => {
    // Wait 4 seconds after page load, then auto-scroll to products
    const timer = setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight * 0.5, // Scroll down half a viewport
        behavior: 'smooth'
      })
    }, 4000) // 4 seconds delay

    return () => clearTimeout(timer)
  }, [])

  return null // This component doesn't render anything
}
