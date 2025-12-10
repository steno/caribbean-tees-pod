'use client'

import { useEffect, useState } from 'react'
import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  CloudSnow, 
  CloudFog,
  CloudDrizzle
} from 'lucide-react'

interface WeatherData {
  temp: number
  iconCode: string
  description: string
}

export function WeatherIcon() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [showTemp, setShowTemp] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather')
        const data = await response.json()
        setWeather(data)
      } catch (error) {
        console.error('Failed to fetch weather:', error)
      }
    }

    fetchWeather()
    // Refresh every 5 minutes
    const interval = setInterval(fetchWeather, 300000)
    return () => clearInterval(interval)
  }, [])

  // Map OpenWeatherMap icon codes to Lucide icons
  const getWeatherIcon = (iconCode: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      '01d': Sun,      // clear sky day
      '01n': Moon,     // clear sky night
      '02d': Cloud,    // few clouds day
      '02n': Cloud,    // few clouds night
      '03d': Cloud,    // scattered clouds
      '03n': Cloud,
      '04d': Cloud,    // broken clouds
      '04n': Cloud,
      '09d': CloudDrizzle, // shower rain
      '09n': CloudDrizzle,
      '10d': CloudRain,    // rain day
      '10n': CloudRain,    // rain night
      '11d': CloudLightning, // thunderstorm
      '11n': CloudLightning,
      '13d': CloudSnow,     // snow
      '13n': CloudSnow,
      '50d': CloudFog,      // mist
      '50n': CloudFog,
    }
    
    const IconComponent = iconMap[iconCode] || Sun
    return IconComponent
  }

  const WeatherIconComponent = weather ? getWeatherIcon(weather.iconCode) : Sun

  return (
    <button
      onClick={() => setShowTemp(!showTemp)}
      className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
      aria-label={weather ? `Weather in Costambar: ${weather.temp}°C, ${weather.description}` : 'Weather'}
      title={weather ? `${weather.temp}°C - ${weather.description}` : 'Weather'}
    >
      <WeatherIconComponent className="w-5 h-5" />
      {weather && showTemp && (
        <span className="text-base font-semibold">{weather.temp}°C</span>
      )}
    </button>
  )
}
