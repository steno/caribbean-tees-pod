import {
  PrintifyProduct,
  PrintifyOrderRequest,
  PrintifyOrderResponse,
} from '@/types/printify'

const PRINTIFY_API_BASE = 'https://api.printify.com/v1'
const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN!
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID!

class PrintifyService {
  private headers = {
    'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
    'Content-Type': 'application/json',
  }

  /**
   * Fetch all products from Printify shop
   */
  async getProducts(): Promise<PrintifyProduct[]> {
    try {
      const response = await fetch(
        `${PRINTIFY_API_BASE}/shops/${PRINTIFY_SHOP_ID}/products.json`,
        {
          method: 'GET',
          headers: this.headers,
          cache: 'no-store',
        }
      )

      if (!response.ok) {
        throw new Error(`Printify API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error('Error fetching products from Printify:', error)
      throw error
    }
  }

  /**
   * Fetch a single product by ID
   */
  async getProduct(productId: string): Promise<PrintifyProduct> {
    try {
      const response = await fetch(
        `${PRINTIFY_API_BASE}/shops/${PRINTIFY_SHOP_ID}/products/${productId}.json`,
        {
          method: 'GET',
          headers: this.headers,
          cache: 'no-store',
        }
      )

      if (!response.ok) {
        throw new Error(`Printify API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching product ${productId} from Printify:`, error)
      throw error
    }
  }

  /**
   * Submit an order to Printify for fulfillment
   * This is the CRITICAL function that creates the actual print order
   */
  async createOrder(orderData: PrintifyOrderRequest): Promise<PrintifyOrderResponse> {
    try {
      console.log('Submitting order to Printify:', JSON.stringify(orderData, null, 2))

      const response = await fetch(
        `${PRINTIFY_API_BASE}/shops/${PRINTIFY_SHOP_ID}/orders.json`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify(orderData),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Printify order creation failed:', errorText)
        throw new Error(`Printify order creation failed: ${response.statusText} - ${errorText}`)
      }

      const result = await response.json()
      console.log('Printify order created successfully:', result.id)
      return result
    } catch (error) {
      console.error('Error creating Printify order:', error)
      throw error
    }
  }

  /**
   * Get shipping methods for calculating costs
   */
  async getShippingMethods(country: string = 'US'): Promise<any[]> {
    try {
      const response = await fetch(
        `${PRINTIFY_API_BASE}/shops/${PRINTIFY_SHOP_ID}/shipping.json?country=${country}`,
        {
          method: 'GET',
          headers: this.headers,
        }
      )

      if (!response.ok) {
        throw new Error(`Printify API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching shipping methods:', error)
      throw error
    }
  }

  /**
   * Calculate shipping cost for a specific order
   */
  async calculateShipping(
    lineItems: { variant_id: number; product_id: string; quantity: number }[],
    country: string = 'US'
  ): Promise<number> {
    try {
      const response = await fetch(
        `${PRINTIFY_API_BASE}/shops/${PRINTIFY_SHOP_ID}/orders/shipping.json`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            line_items: lineItems,
            address_to: {
              country: country,
            },
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Printify API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.standard || 0
    } catch (error) {
      console.error('Error calculating shipping:', error)
      return 0 // Return 0 as fallback
    }
  }

  /**
   * Get order status from Printify
   */
  async getOrder(orderId: string): Promise<PrintifyOrderResponse> {
    try {
      const response = await fetch(
        `${PRINTIFY_API_BASE}/shops/${PRINTIFY_SHOP_ID}/orders/${orderId}.json`,
        {
          method: 'GET',
          headers: this.headers,
        }
      )

      if (!response.ok) {
        throw new Error(`Printify API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error)
      throw error
    }
  }

  /**
   * Send order to production (if auto-approval is disabled)
   */
  async sendToProduction(orderId: string): Promise<void> {
    try {
      const response = await fetch(
        `${PRINTIFY_API_BASE}/shops/${PRINTIFY_SHOP_ID}/orders/${orderId}/send_to_production.json`,
        {
          method: 'POST',
          headers: this.headers,
        }
      )

      if (!response.ok) {
        throw new Error(`Printify API error: ${response.statusText}`)
      }

      console.log(`Order ${orderId} sent to production`)
    } catch (error) {
      console.error(`Error sending order ${orderId} to production:`, error)
      throw error
    }
  }
}

export const printifyService = new PrintifyService()

