import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// USD to DOP exchange rate (Dominican Peso)
// Update this periodically or fetch from an API
// Current rate: 1 USD = ~58.5 DOP (as of Dec 2024)
const USD_TO_DOP_RATE = process.env.NEXT_PUBLIC_USD_TO_DOP_RATE 
  ? parseFloat(process.env.NEXT_PUBLIC_USD_TO_DOP_RATE) 
  : 58.5

export function formatPrice(cents: number, currency: 'USD' | 'DOP' = 'DOP'): string {
  if (currency === 'DOP') {
    // Convert USD cents to DOP
    const dopAmount = (cents / 100) * USD_TO_DOP_RATE
    
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(dopAmount)
  }
  
  // Fallback to USD
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

