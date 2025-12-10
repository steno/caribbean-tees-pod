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
      return NextResponse.json({
        temp: 28,
        iconCode: '01d',
        description: 'Sunny'
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

    return NextResponse.json({
      temp: Math.round(data.main.temp),
      iconCode: iconCode,
      description: data.weather[0].description
    })
  } catch (error) {
    console.error('Weather fetch error:', error)
    // Return fallback data
    return NextResponse.json({
      temp: 28,
      iconCode: '01d',
      description: 'Sunny'
    })
  }
}
