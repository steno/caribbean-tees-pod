'use client'

import { useEffect, useState } from 'react'

export function AutoScroll() {
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    // Immediately scroll to top on page load/refresh
    window.scrollTo({ top: 0, behavior: 'instant' })

    // Listen for video loaded event
    const handleVideoLoaded = () => {
      console.log('AutoScroll: Received heroVideoLoaded event')
      setVideoLoaded(true)
    }

    window.addEventListener('heroVideoLoaded', handleVideoLoaded)
    console.log('AutoScroll: Listening for heroVideoLoaded event')

    return () => {
      window.removeEventListener('heroVideoLoaded', handleVideoLoaded)
    }
  }, [])

  useEffect(() => {
    if (!videoLoaded) return

    console.log('AutoScroll: Video loaded, starting 2 second timer')
    // Wait 2 seconds after video loads, then auto-scroll to products
    const timer = setTimeout(() => {
      const isMobile = window.innerWidth < 768
      const scrollOffset = isMobile 
        ? window.innerHeight * 0.75 // Mobile: calc(75vh-64px) hero height, scroll to end of hero
        : window.innerHeight * 0.5 + 69 // Desktop: original offset
      
      console.log('AutoScroll: Scrolling to offset:', scrollOffset)
      window.scrollTo({
        top: scrollOffset,
        behavior: 'smooth'
      })
    }, 2000) // 2 seconds delay after video loads

    return () => clearTimeout(timer)
  }, [videoLoaded])

  return null // This component doesn't render anything
}

