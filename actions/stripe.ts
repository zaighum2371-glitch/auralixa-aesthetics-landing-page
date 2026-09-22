'use server'

import Stripe from 'stripe'

export async function createCheckoutSession(
  bookingId: string,
  paymentType: 'deposit' | 'full',
  price: number,
  treatmentName: string
) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set. Please ensure it is added to your .env or .env.local file.')
  }
  
  const getBaseUrl = () => {
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
    if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
    return 'http://localhost:3000'
  }
  const siteUrl = getBaseUrl()

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-01-27.acacia',
  })

  // Calculate amount in cents (GBP pence)
  // Deposit is 20%
  const amountToCharge = paymentType === 'deposit' ? Math.round(price * 0.2 * 100) : Math.round(price * 100)
  
  const paymentLabel = paymentType === 'deposit' 
    ? `20% Deposit: ${treatmentName}` 
    : `Full Payment: ${treatmentName}`

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'klarna'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: paymentLabel,
            },
            unit_amount: amountToCharge,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${siteUrl}/booking-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancel_url: `${siteUrl}/`, 
      metadata: {
        booking_id: bookingId,
        payment_type: paymentType,
        treatment_name: treatmentName
      },
    })

    if (!session.url) {
      throw new Error('Failed to create Stripe session URL')
    }

    return { url: session.url }
  } catch (error: any) {
    console.error('Stripe error:', error)
    throw new Error(error.message || 'Error creating checkout session')
  }
}
