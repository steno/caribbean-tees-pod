'use client'

import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/utils'
import { X, Minus, Plus, ShoppingBag, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export function CartSlideOver() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice } = useCartStore()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Mount the component
      setShouldRender(true)
      // Trigger slide-in animation after a brief delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 10)
      return () => clearTimeout(timer)
    } else if (shouldRender) {
      // Trigger slide-out animation
      setIsVisible(false)
      // Unmount after animation completes
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 300) // Match animation duration
      return () => clearTimeout(timer)
    }
  }, [isOpen, shouldRender])

  const handleClose = () => {
    closeCart()
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: items,
        }),
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('There was an error processing your checkout. Please try again.')
      setIsCheckingOut(false)
    }
  }

  if (!shouldRender) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Slide-over panel */}
      <div className={`fixed inset-y-0 right-0 max-w-md w-full bg-white/95 backdrop-blur-md shadow-xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-ocean-600" />
            Your Cart
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-sand-300 mb-4" />
              <p className="text-lg text-gray-600 mb-2">Your cart is empty</p>
              <p className="text-sm text-gray-400">Add some island vibes to your wardrobe!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product_id}-${item.printify_variant_id}`}
                  className="flex gap-4 bg-sand-50 rounded-lg p-4"
                >
                  {/* Product Image */}
                  {item.image_url && (
                    <div className="flex-shrink-0 w-28 h-28 bg-white rounded-md overflow-hidden shadow-sm">
                      <Image
                        src={item.image_url}
                        alt={item.product_title}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.product_title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{item.variant_title}</p>
                    <p className="text-sm font-semibold text-ocean-700 mt-1">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product_id,
                            item.printify_variant_id,
                            item.quantity - 1
                          )
                        }
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-sand-300 hover:bg-sand-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product_id,
                            item.printify_variant_id,
                            item.quantity + 1
                          )
                        }
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-sand-300 hover:bg-sand-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.product_id, item.printify_variant_id)}
                    className="text-gray-400 hover:text-coral-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Total and Checkout */}
        {items.length > 0 && (
          <div className="border-t border-sand-200 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-medium text-gray-900">Subtotal</span>
              <span className="text-xl font-bold text-ocean-700">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Shipping and taxes calculated at checkout
            </p>
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-gradient-to-r from-ocean-600 to-ocean-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-ocean-700 hover:to-ocean-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Checkout
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

