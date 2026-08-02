// ===========================================================================
// lib/paypal/server.ts
// Server-side PayPal REST API helpers.
//
// Uses PAYPAL_CLIENT_ID + PAYPAL_CLIENT_SECRET environment variables.
// Defaults to the PayPal sandbox API base.
// ===========================================================================

export interface PayPalLineItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface PayPalOrderInput {
  orderId: string;
  items: PayPalLineItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

const PAYPAL_API = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET must be set in environment variables ' +
        'to use server-side PayPal. Get them from https://developer.paypal.com/dashboard/applications/sandbox',
    );
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal access token failed (${res.status}): ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

/**
 * Creates a PayPal order from the customer's cart.
 */
export async function createPayPalOrder(input: PayPalOrderInput): Promise<{ id: string }> {
  const token = await getAccessToken();

  const items = input.items.map((item) => ({
    name: item.name.slice(0, 127),
    unit_amount: { currency_code: 'USD', value: item.price.toFixed(2) },
    quantity: String(item.quantity),
  }));

  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': input.orderId,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: input.orderId,
          description: 'Cosmic Kicks order',
          amount: {
            currency_code: 'USD',
            value: input.total.toFixed(2),
            breakdown: {
              item_total: { currency_code: 'USD', value: input.subtotal.toFixed(2) },
              shipping: { currency_code: 'USD', value: input.shipping.toFixed(2) },
            },
          },
          items,
        },
      ],
      application_context: {
        brand_name: 'Cosmic Kicks',
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING',
      },
    }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal order creation failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = (await res.json()) as { id: string };
  return { id: data.id };
}

/**
 * Captures an approved PayPal order.
 */
export async function capturePayPalOrder(orderId: string): Promise<{ id: string; status: string }> {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal capture failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = (await res.json()) as { id?: string; status?: string };
  return { id: data.id ?? orderId, status: data.status ?? 'COMPLETED' };
}
