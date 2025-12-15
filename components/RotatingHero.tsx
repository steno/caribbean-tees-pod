'use client'

import { useState, useEffect, useRef } from 'react'

const videoSrc = '/home-bg1.mp4'
const placeholderImage = '/home-photo.jpg'

export function RotatingHero() {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Preload placeholder image and video for better performance
  useEffect(() => {
    // Preload placeholder image
    const imageLink = document.createElement('link')
    imageLink.rel = 'preload'
    imageLink.as = 'image'
    imageLink.href = placeholderImage
    document.head.appendChild(imageLink)

    // Preload video
    const videoLink = document.createElement('link')
    videoLink.rel = 'preload'
    videoLink.as = 'video'
    videoLink.href = videoSrc
    document.head.appendChild(videoLink)

    // Also preload using Image object to ensure it's cached
    const img = new Image()
    img.src = placeholderImage

    // Preload video using video element to ensure it's cached
    const video = document.createElement('video')
    video.src = videoSrc
    video.preload = 'auto'
    video.muted = true
    video.load()
  }, [])

  const handleVideoCanPlay = () => {
    if (!videoLoaded) {
      setVideoLoaded(true)
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setShowPlaceholder(false)
      }, 100)
    }
  }

  const handleVideoLoadedData = () => {
    if (!videoLoaded) {
      setVideoLoaded(true)
      setTimeout(() => {
        setShowPlaceholder(false)
      }, 100)
    }
  }

  // Ensure video plays when ready and start loading immediately
  useEffect(() => {
    if (videoRef.current) {
      // Start loading the video immediately
      videoRef.current.load()
      
      if (videoLoaded) {
        videoRef.current.play().catch((error) => {
          console.error('Error playing video:', error)
        })
      }
    }
  }, [videoLoaded])


  return (
    <section className="fixed top-0 left-0 right-0 w-full overflow-hidden -z-10 h-[75vh] md:h-[70vh]">
      {/* Placeholder Image - Shown while video loads */}
      <div
        className={`absolute inset-0 bg-cover bg-no-repeat bg-[center_top] md:bg-[center_calc(50%+20px)] transition-opacity duration-1000 ${
          showPlaceholder ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url('${placeholderImage}')`,
        }}
      />
      
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoLoaded && !showPlaceholder ? 'opacity-100' : 'opacity-0'
        }`}
        onCanPlay={handleVideoCanPlay}
        onLoadedData={handleVideoLoadedData}
        onError={(e) => {
          console.error('Video failed to load:', e)
        }}
        poster={placeholderImage}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </section>
  )
}





