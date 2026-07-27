// ===========================================================================
// app/api/webhooks/stripe/route.ts
// Stripe webhook handler — Next.js API Route version.
//
// Listens for checkout.session.completed events and automatically
// processes the order through the double-entry accounting engine.
//
// For local testing:
//   stripe listen --forward-to localhost:3000/api/webhooks/stripe
//
// For production Stripe dashboard:
//   Add endpoint: https://yourdomain.com/api/webhooks/stripe
// ===========================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createStripeClient, getWebhookSecret } from '@/lib/stripe/server';
import { processOrderAccounting } from '@/lib/accounting/process-order';
import type { OrderAccountingData, OrderLineItem } from '@/types/accounting';

// Stripe requires raw body for signature verification
};

async function bufferRequestBody(request: NextRequest): Promise<Buffer> {
  const arrayBuffer = await request.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Parse the item metadata passed from the checkout session.
 * This contains product costs for COGS calculation.
 */
function parseItemMetadata(
  metadataItems: string,
  sessionId: string,
): OrderLineItem[] {
  try {
    const parsed = JSON.parse(metadataItems);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('Item metadata is empty or not an array');
    }
    return parsed.map((item: any, index: number) => ({
      product_id: item.product_id || `unknown_${index}`,
      product_name: item.product_name || `Item ${index + 1}`,
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.unit_price) || 0,
      unit_cost: Number(item.unit_cost) || 0,
    }));
  } catch (e) {
    throw new Error(
      `Failed to parse item metadata for session ${sessionId}: ` +
      `${e instanceof Error ? e.message : 'Invalid JSON'}. ` +
      'Ensure the checkout session includes items JSON in metadata.'
    );
  }
}

/**
 * Compute the subtotal from line items (excluding shipping/tax).
 * Stripe provides amount_subtotal in cents.
 */
function computeSubtotal(items: OrderLineItem[]): number {
  return Math.round(
    items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0) * 100
  ) / 100;
}

export async function POST(request: NextRequest) {
  try {
    // --------------------------------------------------
    // 1. Verify webhook signature
    // --------------------------------------------------
    const rawBody = await bufferRequestBody(request);
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 },
      );
    }

    const stripe = createStripeClient();
    const webhookSecret = getWebhookSecret();

    let event: ReturnType<typeof stripe.webhooks.constructEvent>;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid signature';
      console.error('[Stripe Webhook] Signature verification failed:', message);
      return NextResponse.json({ error: message }, { status: 401 });
    }

    // --------------------------------------------------
    // 2. Handle checkout.session.completed
    // --------------------------------------------------
    if (event.type !== 'checkout.session.completed') {
      // Acknowledge other events (ping, etc.) but don't process them
      return NextResponse.json({ received: true });
    }

    const session = event.data.object as any;
    const sessionId = session.id;
    console.log(`[Stripe Webhook] Processing completed session: ${sessionId}`);

    // --------------------------------------------------
    // 3. Extract order data from the session
    // --------------------------------------------------

    // Parse item metadata (contains cost info for COGS)
    const itemMetadataRaw = session.metadata?.items;
    if (!itemMetadataRaw) {
      throw new Error(
        `Session ${sessionId} has no items metadata. ` +
        'Ensure the checkout API passes items JSON in metadata.'
      );
    }

    const items = parseItemMetadata(itemMetadataRaw, sessionId);
    const subtotal = computeSubtotal(items);
    const shippingAmount = Number(session.metadata?.shipping_amount) || 0;
    const taxAmount = Number(session.metadata?.tax_amount) || 0;
    const totalAmount = session.amount_total
      ? Math.round((session.amount_total / 100) * 100) / 100
      : subtotal + shippingAmount + taxAmount;

    // Build the order data for the accounting engine
    const orderData: OrderAccountingData = {
      id: sessionId,
      order_date: new Date(
        session.created * 1000 // Stripe uses Unix timestamps
      ).toISOString().split('T')[0],
      total_amount: totalAmount,
      subtotal,
      shipping_amount: shippingAmount > 0 ? shippingAmount : undefined,
      tax_amount: taxAmount > 0 ? taxAmount : undefined,
      payment_fee: undefined, // Stripe fee handled separately
      items,
    };

    // --------------------------------------------------
    // 4. Process through the accounting engine
    // --------------------------------------------------

    // Idempotency: the accounting engine uses the session ID as reference_id
    // and the unique constraint on (reference_id, 'order') prevents duplicates.
    // If the webhook fires twice, the second call will throw a duplicate error
    // which we catch and acknowledge gracefully.

    const result = await processOrderAccounting({
      order: orderData,
      mode: 'combined',
    });

    if (!result.success) {
      // Check if it's a duplicate entry (webhook re-delivery)
      if (result.error?.includes('already has accounting entries')) {
        console.log(`[Stripe Webhook] Duplicate event for ${sessionId} — acknowledged`);
        return NextResponse.json({
          received: true,
          status: 'duplicate',
          message: 'Already processed',
        });
      }

      throw new Error(result.error || 'Accounting processing failed');
    }

    console.log(
      `[Stripe Webhook] ✅ Accounting entry ${result.journal_entry_id} ` +
      `created for order ${sessionId}`
    );

    // --------------------------------------------------
    // 5. Return 200 to acknowledge the webhook
    // --------------------------------------------------
    return NextResponse.json({
      received: true,
      journal_entry_id: result.journal_entry_id,
      debits_total: result.debits_total,
      credits_total: result.credits_total,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook processing failed';
    console.error('[Stripe Webhook] Fatal error:', error);

    // Always return 200 for webhook errors to prevent Stripe retries
    // from causing duplicate processing attempts.
    return NextResponse.json({
      received: true,
      error: message,
      note: 'Error was logged but webhook acknowledged to prevent retry loops',
    });
  }
}
