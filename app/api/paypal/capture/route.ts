// ===========================================================================
// app/api/paypal/capture/route.ts
// Captures an approved PayPal order and records it (best-effort accounting).
// ===========================================================================

import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal/server';
import { processOrderAccounting } from '@/lib/accounting/process-order';
import type { OrderAccountingData, OrderLineItem } from '@/types/accounting';

interface RawItem {
  id?: unknown;
  name?: unknown;
  price?: unknown;
  quantity?: unknown;
  unit_cost?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      orderId?: unknown;
      items?: RawItem[];
      subtotal?: unknown;
      shipping?: unknown;
      total?: unknown;
    };

    const orderId = String(body.orderId || '');

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const { id: captureId, status } = await capturePayPalOrder(orderId);

    // Best-effort: record the sale through the double-entry accounting engine.
    // Gracefully skips if Supabase env vars are not configured.
    try {
      const items: OrderLineItem[] = (Array.isArray(body.items) ? body.items : []).map((item) => {
        const price = Number(item.price) || 0;
        return {
          product_id: String(item.id ?? 'unknown'),
          product_name: String(item.name ?? 'Item'),
          quantity: Number(item.quantity) || 1,
          unit_price: price,
          unit_cost: Number(item.unit_cost) || Math.round(price * 0.4 * 100) / 100,
        };
      });

      const subtotal = Number(body.subtotal) || items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
      const shipping = Number(body.shipping) || 0;

      const orderData: OrderAccountingData = {
        id: captureId,
        order_date: new Date().toISOString().split('T')[0],
        total_amount: Number(body.total) || subtotal + shipping,
        subtotal,
        shipping_amount: shipping > 0 ? shipping : undefined,
        items,
      };

      const result = await processOrderAccounting({ order: orderData });
      if (!result.success) {
        console.warn('[PayPal Capture] Accounting skipped:', result.error);
      }
    } catch (err) {
      console.warn('[PayPal Capture] Best-effort accounting failed:', err);
    }

    return NextResponse.json({ success: true, captureId, orderId, status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'PayPal capture failed';
    console.error('[PayPal Capture] Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
