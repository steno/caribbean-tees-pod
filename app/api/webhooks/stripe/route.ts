import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getAdminDb } from '@/lib/firebase-admin'
import { printifyService } from '@/lib/printify-service'
import { PrintifyOrderRequest } from '@/types/printify'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

/**
 * CRITICAL WEBHOOK: This route receives Stripe payment confirmations
 * and automatically submits orders to Printify for fulfillment.
 * 
 * Flow:
 * 1. Verify Stripe webhook signature
 * 2. Extract customer and order details
 * 3. Save order to Firestore
 * 4. Format order for Printify API
 * 5. Submit to Printify for printing and shipping
 */
export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')!

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('🎣 Webhook received:', event.type)

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      console.log('💰 Processing completed checkout:', session.id)

      // Retrieve full session with line items
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items', 'line_items.data.price.product', 'customer'],
      })

      // Extract shipping details
      const shippingDetails = fullSession.shipping_details || fullSession.customer_details
      
      if (!shippingDetails?.address) {
        throw new Error('Missing shipping address')
      }

      const { address, name, phone } = shippingDetails
      const email = fullSession.customer_details?.email || ''

      // Parse line items with variant IDs from metadata
      const lineItems = fullSession.line_items?.data || []
      const cartItems = []

      for (const item of lineItems) {
        const metadata = (item.price?.product as Stripe.Product)?.metadata || {}
        
        cartItems.push({
          printify_product_id: metadata.printify_product_id,
          printify_variant_id: parseInt(metadata.printify_variant_id || '0'),
          quantity: item.quantity || 1,
          price: item.amount_total || 0,
        })
      }

      // Get Firestore database
      const db = getAdminDb()

      // Save order to Firestore
      const orderRef = db.collection('orders').doc()
      await orderRef.set({
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string,
        customer_email: email,
        customer_name: name || '',
        shipping_address: {
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country,
        },
        total_amount: session.amount_total || 0,
        status: 'paid',
        line_items: cartItems,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      console.log('✅ Order saved to Firestore:', orderRef.id)

      // ==========================================
      // CRITICAL: Submit order to Printify
      // ==========================================

      // Check if we're in Stripe test mode
      const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')

      if (isTestMode) {
        console.log('🧪 TEST MODE: Skipping Printify order submission')
        console.log('   • Order saved to Firestore for testing')
        console.log('   • No real Printify order will be created')
        console.log('   • Switch to live Stripe keys (sk_live_) for production')
        
        await orderRef.update({
          status: 'test_order_not_submitted',
          test_mode: true,
          updated_at: new Date().toISOString(),
        })

        return NextResponse.json({ 
          received: true, 
          order_id: orderRef.id,
          test_mode: true,
          message: 'Test order - not submitted to Printify'
        })
      }

      // Split name into first and last
      const nameParts = (name || '').split(' ')
      const firstName = nameParts[0] || 'Customer'
      const lastName = nameParts.slice(1).join(' ') || 'Customer'

      // Build Printify order payload
      const printifyOrder: PrintifyOrderRequest = {
        external_id: orderRef.id, // Use our Firestore document ID for tracking
        label: `Order #${session.id.slice(-8)}`,
        line_items: cartItems.map(item => ({
          product_id: item.printify_product_id,
          variant_id: item.printify_variant_id,
          quantity: item.quantity,
        })),
        shipping_method: 1, // Standard shipping (you can make this dynamic)
        send_shipping_notification: true, // Let Printify email tracking info
        address_to: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone || '',
          country: address.country || 'US',
          region: address.state || '',
          address1: address.line1 || '',
          address2: address.line2 || '',
          city: address.city || '',
          zip: address.postal_code || '',
        },
      }

      console.log('📮 Submitting order to Printify...')
      const printifyResponse = await printifyService.createOrder(printifyOrder)

      // Update order with Printify ID
      await orderRef.update({
        printify_order_id: printifyResponse.id,
        status: 'submitted_to_printify',
        updated_at: new Date().toISOString(),
      })

      console.log('🎉 ORDER AUTOMATION COMPLETE!')
      console.log('   • Stripe Session:', session.id)
      console.log('   • Firestore Order:', orderRef.id)
      console.log('   • Printify Order:', printifyResponse.id)
      console.log('   • Customer will receive shipping notification from Printify')

      return NextResponse.json({ 
        received: true, 
        order_id: orderRef.id,
        printify_order_id: printifyResponse.id 
      })

    } catch (error: any) {
      console.error('❌ Error processing webhook:', error)
      
      // Log the error but return 200 to prevent Stripe from retrying
      // (You might want to implement a retry queue instead)
      return NextResponse.json({ 
        received: true, 
        error: error.message 
      }, { status: 200 })
    }
  }

  // For other event types
  return NextResponse.json({ received: true })
}
