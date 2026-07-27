// ===========================================================================
// supabase/functions/stripe-webhook/index.ts
// Supabase Edge Function — Stripe webhook handler.
//
// Deploy:
//   supabase functions deploy stripe-webhook --no-verify-jwt
//
// Set secrets:
//   supabase secrets set STRIPE_SECRET_KEY=sk_test_...
//   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
//   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
//   supabase secrets set NEXT_PUBLIC_SUPABASE_URL=https://pebrqpcohjrtwmyzfccn.supabase.co
//
// Stripe Dashboard webhook URL:
//   https://pebrqpcohjrtwmyzfccn.functions.supabase.co/stripe-webhook
// ===========================================================================

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.110.1';
import Stripe from 'https://esm.sh/stripe@17.6.0?target=deno&deno-std=0.208.0';

// ---------------------------------------------------------------------------
// Types (mirrored from types/accounting.ts for Edge Function isolation)
// ---------------------------------------------------------------------------

interface OrderLineItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  unit_cost: number;
}

interface OrderAccountingData {
  id: string;
  order_date: string;
  total_amount: number;
  subtotal: number;
  shipping_amount?: number;
  tax_amount?: number;
  payment_fee?: number;
  items: OrderLineItem[];
}

interface AccountingResult {
  success: boolean;
  journal_entry_id?: number;
  revenue_entry_id?: number;
  cogs_entry_id?: number;
  message: string;
  error?: string;
}

const STANDARD_ACCOUNT_CODES = {
  CASH: '1010',
  INVENTORY: '1200',
  SALES_TAX_PAYABLE: '2100',
  RETAINED_EARNINGS: '3010',
  SALES_REVENUE: '4010',
  SHIPPING_REVENUE: '4020',
  COST_OF_GOODS_SOLD: '5010',
  PAYMENT_PROCESSING_FEES: '5020',
  SHIPPING_EXPENSE: '5030',
} as const;

// ---------------------------------------------------------------------------
// Accounting Engine (self-contained for Edge Function)
// ---------------------------------------------------------------------------

async function fetchAccountMap(supabase: any) {
  const codes = Object.values(STANDARD_ACCOUNT_CODES);

  const { data: accounts, error } = await supabase
    .from('chart_of_accounts')
    .select('*')
    .in('code', codes)
    .eq('is_active', true);

  if (error) throw new Error(`Failed to fetch accounts: ${error.message}`);
  if (!accounts || accounts.length === 0) {
    throw new Error('No chart of accounts found. Run migration first.');
  }

  const byCode = new Map(accounts.map((a: any) => [a.code, a]));

  const required = ['1010', '1200', '4010', '5010'];
  for (const code of required) {
    if (!byCode.has(code)) {
      throw new Error(`Required account ${code} missing from chart_of_accounts`);
    }
  }

  return {
    cash: byCode.get('1010'),
    inventory: byCode.get('1200'),
    salesRevenue: byCode.get('4010'),
    costOfGoodsSold: byCode.get('5010'),
    shippingRevenue: byCode.get('4020'),
    salesTaxPayable: byCode.get('2100'),
  };
}

function buildRevenueLines(accounts: any, order: OrderAccountingData) {
  const lines: any[] = [];

  lines.push({
    account_id: accounts.cash.id,
    entry_type: 'debit',
    amount: order.total_amount,
    description: `Payment received for order ${order.id}`,
  });

  lines.push({
    account_id: accounts.salesRevenue.id,
    entry_type: 'credit',
    amount: order.subtotal,
    description: `Product sales for order ${order.id}`,
  });

  if (order.shipping_amount && order.shipping_amount > 0 && accounts.shippingRevenue) {
    lines.push({
      account_id: accounts.shippingRevenue.id,
      entry_type: 'credit',
      amount: order.shipping_amount,
      description: `Shipping revenue for order ${order.id}`,
    });
  }

  if (order.tax_amount && order.tax_amount > 0 && accounts.salesTaxPayable) {
    lines.push({
      account_id: accounts.salesTaxPayable.id,
      entry_type: 'credit',
      amount: order.tax_amount,
      description: `Sales tax collected for order ${order.id}`,
    });
  }

  return lines;
}

function buildCogsLines(accounts: any, order: OrderAccountingData) {
  const totalCogs = Math.round(
    order.items.reduce((s, item) => s + item.unit_cost * item.quantity, 0) * 100
  ) / 100;

  if (totalCogs <= 0) {
    throw new Error(`Cannot process COGS for order ${order.id}: total cost is ${totalCogs}`);
  }

  const desc = order.items.map((i) => `${i.quantity}x ${i.product_name}`).join(', ');

  return [
    {
      account_id: accounts.costOfGoodsSold.id,
      entry_type: 'debit',
      amount: totalCogs,
      description: `COGS for order ${order.id}: ${desc}`,
    },
    {
      account_id: accounts.inventory.id,
      entry_type: 'credit',
      amount: totalCogs,
      description: `Inventory reduction for order ${order.id}: ${desc}`,
    },
  ];
}

async function createJournalEntry(supabase: any, input: {
  entry_date: string;
  reference_id: string;
  reference_type: string;
  description: string;
  lines: any[];
}) {
  const { data: entry, error: entryError } = await supabase
    .from('journal_entries')
    .insert({
      entry_date: input.entry_date,
      reference_id: input.reference_id,
      reference_type: input.reference_type,
      description: input.description,
      is_posted: true,
      posted_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (entryError) {
    if (entryError.code === '23505') {
      throw new Error(`Duplicate: order ${input.reference_id} already has entries`);
    }
    throw new Error(`Failed to insert entry: ${entryError.message}`);
  }

  const { error: linesError } = await supabase
    .from('journal_entry_lines')
    .insert(
      input.lines.map((l) => ({
        journal_entry_id: entry.id,
        account_id: l.account_id,
        entry_type: l.entry_type,
        amount: l.amount,
        description: l.description ?? null,
      }))
    );

  if (linesError) {
    await supabase.from('journal_entries').delete().eq('id', entry.id);
    throw new Error(`Failed to insert lines: ${linesError.message}`);
  }

  return { journalEntryId: entry.id };
}

async function processOrderAccountingFn(
  supabase: any,
  order: OrderAccountingData,
): Promise<AccountingResult> {
  try {
    const accounts = await fetchAccountMap(supabase);
    const revenueLines = buildRevenueLines(accounts, order);
    const cogsLines = buildCogsLines(accounts, order);
    const combinedLines = [...revenueLines, ...cogsLines];

    const totalDebits = combinedLines
      .filter((l: any) => l.entry_type === 'debit')
      .reduce((s: number, l: any) => s + l.amount, 0);
    const totalCredits = combinedLines
      .filter((l: any) => l.entry_type === 'credit')
      .reduce((s: number, l: any) => s + l.amount, 0);

    const { journalEntryId } = await createJournalEntry(supabase, {
      entry_date: order.order_date,
      reference_id: order.id,
      reference_type: 'order',
      description: `Sale — Order ${order.id}`,
      lines: combinedLines,
    });

    return {
      success: true,
      journal_entry_id: journalEntryId,
      message: `Entry ${journalEntryId} created for order ${order.id}`,
      debits_total: Math.round(totalDebits * 100) / 100,
      credits_total: Math.round(totalCredits * 100) / 100,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Accounting] Error:`, error);
    return { success: false, message: 'Accounting failed', error: message };
  }
}

// ---------------------------------------------------------------------------
// Webhook Handler
// ---------------------------------------------------------------------------

serve(async (req) => {
  try {
    // 1. Verify it's a POST request
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // 2. Verify Stripe signature
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('Missing stripe-signature', { status: 400 });
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('NEXT_PUBLIC_SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing environment variables');
    }

    // Parse and verify the webhook event
    let event;
    try {
      const stripe = Stripe(stripeSecretKey, { apiVersion: '2025-02-24.acacia' });
      const rawBody = await req.text();
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid signature';
      console.error('[EdgeFn] Signature verification failed:', msg);
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Only process checkout.session.completed
    if (event.type !== 'checkout.session.completed') {
      return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const session = event.data.object;
    const sessionId = session.id;
    console.log('[EdgeFn] Processing session:', sessionId);

    // Extract order data from session metadata
    const itemMetadataRaw = session.metadata?.items;
    if (!itemMetadataRaw) {
      console.error('[EdgeFn] No items metadata for session:', sessionId);
      return new Response(JSON.stringify({ received: true, note: 'No items metadata' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const items = JSON.parse(itemMetadataRaw).map((item, i) => ({
      product_id: item.product_id || 'unknown_' + i,
      product_name: item.product_name || 'Item ' + (i + 1),
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.unit_price) || 0,
      unit_cost: Number(item.unit_cost) || 0,
    }));

    const subtotal = Math.round(items.reduce((s, i) => s + i.unit_price * i.quantity, 0) * 100) / 100;
    const shippingAmount = Number(session.metadata?.shipping_amount) || 0;
    const taxAmount = Number(session.metadata?.tax_amount) || 0;
    const totalAmount = session.amount_total
      ? Math.round((session.amount_total / 100) * 100) / 100
      : subtotal + shippingAmount + taxAmount;

    const orderData = {
      id: sessionId,
      order_date: new Date(session.created * 1000).toISOString().split('T')[0],
      total_amount: totalAmount,
      subtotal,
      shipping_amount: shippingAmount > 0 ? shippingAmount : undefined,
      tax_amount: taxAmount > 0 ? taxAmount : undefined,
      items,
    };

    // Process through accounting engine
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const result = await processOrderAccountingFn(supabase, orderData);

    if (!result.success) {
      if (result.error && result.error.includes('already has entries')) {
        console.log('[EdgeFn] Duplicate for', sessionId);
        return new Response(JSON.stringify({ received: true, status: 'duplicate' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw new Error(result.error || 'Accounting failed');
    }

    console.log('[EdgeFn] Entry', result.journal_entry_id, 'created');
    return new Response(
      JSON.stringify({ received: true, journal_entry_id: result.journal_entry_id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[EdgeFn] Fatal:', error);
    return new Response(
      JSON.stringify({ received: true, error: message }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }
});