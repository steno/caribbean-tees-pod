import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(req: Request) {
  try {
    const { cartItems } = await req.json()

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Format line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map(
      (item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product_title,
            description: item.variant_title,
            images: item.image_url ? [item.image_url] : [],
            metadata: {
              printify_product_id: item.printify_product_id,
              printify_variant_id: item.printify_variant_id.toString(),
            },
          },
          unit_amount: item.price, // Price in cents
        },
        quantity: item.quantity,
      })
    )

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'NZ', 'JM', 'BB', 'TT', 'BS', 'DO'], // Dominican Republic & Caribbean countries included!
      },
      customer_email: undefined, // Let customer enter their email
      metadata: {
        cart_items: JSON.stringify(cartItems),
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

