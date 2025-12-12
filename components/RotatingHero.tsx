'use client'

import { useState, useEffect } from 'react'

const images = ['/home-photo.jpg', '/home-photo2.jpg']

export function RotatingHero() {
  // Randomly select starting image
  const [currentImageIndex, setCurrentImageIndex] = useState(() => 
    Math.floor(Math.random() * images.length)
  )

  // Preload all images for better performance
  useEffect(() => {
    images.forEach((image) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = image
      document.head.appendChild(link)
    })

    // Also preload using Image objects to ensure they're cached
    images.forEach((image) => {
      const img = new Image()
      img.src = image
    })
  }, [])

  useEffect(() => {
    // Rotate images every 10 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 10000) // 10 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="sticky top-16 md:top-0 overflow-hidden -z-10 h-[calc(75vh-64px)] md:h-[calc(70vh-100px)]">
      {/* Background Images - Rotating */}
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 bg-cover bg-no-repeat bg-[center_top] md:bg-[center_calc(50%+20px)] transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url('${image}')`,
          }}
        />
      ))}
    </section>
  )
}

