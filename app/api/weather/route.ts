import { NextResponse } from 'next/server'

// Costambar, Dominican Republic coordinates
const COSTAMBAR_LAT = 19.8333
const COSTAMBAR_LON = -70.6333

export async function GET() {
  try {
    // Using OpenWeatherMap API (free tier)
    // You'll need to add OPENWEATHER_API_KEY to your .env.local
    const apiKey = process.env.OPENWEATHER_API_KEY
    
    if (!apiKey) {
      // Return default/fallback data if API key not configured
      // Try to determine if it's night based on current time (rough estimate for Costambar timezone)
      const currentHour = new Date().getUTCHours() - 4 // UTC-4 for Dominican Republic
      const isNight = currentHour < 6 || currentHour >= 18
      
      return NextResponse.json({
        temp: 28,
        iconCode: isNight ? '01n' : '01d',
        description: 'Sunny',
        isNight: isNight
      })
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${COSTAMBAR_LAT}&lon=${COSTAMBAR_LON}&units=metric&appid=${apiKey}`
    
    const response = await fetch(url, {
      next: { revalidate: 300 } // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error('Weather API error')
    }

    const data = await response.json()
    
    // Get weather icon code from OpenWeatherMap
    const iconCode = data.weather[0].icon
    
    // Determine if it's nighttime based on sunrise/sunset times
    const currentTime = Math.floor(Date.now() / 1000) // Current time in Unix timestamp
    const sunrise = data.sys.sunrise
    const sunset = data.sys.sunset
    const isNight = currentTime < sunrise || currentTime > sunset

    return NextResponse.json({
      temp: Math.round(data.main.temp),
      iconCode: iconCode,
      description: data.weather[0].description,
      isNight: isNight
    })
  } catch (error) {
    console.error('Weather fetch error:', error)
    // Return fallback data
    // Try to determine if it's night based on current time (rough estimate for Costambar timezone)
    const currentHour = new Date().getUTCHours() - 4 // UTC-4 for Dominican Republic
    const isNight = currentHour < 6 || currentHour >= 18
    
    return NextResponse.json({
      temp: 28,
      iconCode: isNight ? '01n' : '01d',
      description: 'Sunny',
      isNight: isNight
    })
  }
}
