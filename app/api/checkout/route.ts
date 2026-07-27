// ===========================================================================
// app/api/checkout/route.ts
// Creates a Stripe Checkout Session from the customer's cart.
// Called by the frontend when the user clicks "Checkout".
// ===========================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createStripeClient } from '@/lib/stripe/server';

/**
 * Expected request body from the frontend.
 */
interface CheckoutRequest {
  /** Cart items with product details */
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    /** Your cost per unit (for COGS calculation in the webhook) */
    unit_cost?: number;
  }>;
  /** Optional: shipping amount in dollars */
  shipping_amount?: number;
  /** Optional: sales tax amount in dollars */
  tax_amount?: number;
  /** Optional: URL to redirect after successful payment */
  success_url?: string;
  /** Optional: URL to redirect if payment is cancelled */
  cancel_url?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 },
      );
    }

    const stripe = createStripeClient();

    // Build Stripe line items from cart
    // We pass unit_cost via metadata for COGS calculation in the webhook
    const lineItems = body.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          metadata: {
            product_id: item.id,
          },
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }));

    // Build metadata with cost info for COGS calculation
    const itemMetadata = body.items.map((item) => ({
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      unit_cost: item.unit_cost ?? Math.round(item.price * 0.4 * 100) / 100, // default 40% cost
    }));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_options: body.shipping_amount
        ? [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                  amount: Math.round(body.shipping_amount * 100),
                  currency: 'usd',
                },
                display_name: 'Shipping',
              },
            },
          ]
        : undefined,
      metadata: {
        items: JSON.stringify(itemMetadata),
        shipping_amount: String(body.shipping_amount ?? 0),
        tax_amount: String(body.tax_amount ?? 0),
      },
      success_url: body.success_url || `${BASE_URL}/?success=true`,
      cancel_url: body.cancel_url || `${BASE_URL}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Checkout creation failed';
    console.error('[Checkout] Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
