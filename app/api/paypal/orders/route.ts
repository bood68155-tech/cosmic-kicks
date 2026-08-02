// ===========================================================================
// app/api/paypal/orders/route.ts
// Creates a PayPal order from the customer's cart on the server.
// ===========================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal/server';
import type { PayPalLineItem } from '@/lib/paypal/server';

interface RawItem {
  id?: unknown;
  name?: unknown;
  price?: unknown;
  quantity?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      items?: RawItem[];
      subtotal?: unknown;
      shipping?: unknown;
      total?: unknown;
      orderId?: unknown;
    };

    const items: PayPalLineItem[] = Array.isArray(body.items)
      ? body.items.map((item) => ({
          id: String(item.id ?? ''),
          name: String(item.name ?? 'Item'),
          price: Math.max(0, Number(item.price) || 0),
          quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
        }))
      : [];

    if (items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const subtotal = Number(body.subtotal) || items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = Number(body.shipping) || 0;
    const total = Number(body.total) || subtotal + shipping;
    const orderId = typeof body.orderId === 'string' && body.orderId ? body.orderId : `pp_${Date.now()}`;

    const { id } = await createPayPalOrder({ orderId, items, subtotal, shipping, total });

    return NextResponse.json({ id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'PayPal order creation failed';
    console.error('[PayPal Orders] Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
