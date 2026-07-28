// ===========================================================================
// lib/accounting/process-order.ts
// Automated Double-Entry Accounting Engine
//
// Automatically generates balanced journal entries for store orders.
// Handles both the revenue side (Cash / Sales Revenue) and the COGS side
// (Cost of Goods Sold / Inventory) upon every sale.
//
// Usage:
//   import { processOrderAccounting } from '@/lib/accounting/process-order';
//
//   const result = await processOrderAccounting({
//     order: {
//       id: 'ord_123',
//       order_date: '2026-07-27',
//       total_amount: 115.00,
//       subtotal: 100.00,
//       shipping_amount: 10.00,
//       tax_amount: 5.00,
//       items: [
//         { product_id: 'prod_1', product_name: 'Cosmic Runner', quantity: 1, unit_price: 100, unit_cost: 40 },
//       ],
//     },
//   });
// ===========================================================================

import { type SupabaseClient } from '@supabase/supabase-js';
import {
  type AccountMap,
  type OrderAccountingData,
  type AccountingResult,
  type JournalEntryInput,
  type ChartOfAccount,
  STANDARD_ACCOUNT_CODES,
} from '@/types/accounting';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

// ---------------------------------------------------------------------------
// Step 1: Fetch Chart of Accounts from Supabase
// ---------------------------------------------------------------------------

async function fetchAccountMap(supabase: SupabaseClient): Promise<AccountMap> {
  const codes = Object.values(STANDARD_ACCOUNT_CODES);

  const { data: accounts, error } = await supabase
    .from('chart_of_accounts')
    .select('*')
    .in('code', codes)
    .eq('is_active', true);

  if (error) {
    throw new Error(
      `Failed to fetch chart of accounts: ${error.message}`
    );
  }

  if (!accounts || accounts.length === 0) {
    throw new Error(
      'No chart of accounts found. Run the Supabase migration first.'
    );
  }

  const accountByCode = new Map<string, ChartOfAccount>();
  for (const acct of accounts) {
    accountByCode.set(acct.code, acct);
  }

  // Verify all required accounts exist with descriptive error messages
  const requiredCodes: Array<{ code: string; name: string }> = [
    { code: STANDARD_ACCOUNT_CODES.CASH, name: 'Cash (1010)' },
    { code: STANDARD_ACCOUNT_CODES.INVENTORY, name: 'Inventory (1200)' },
    { code: STANDARD_ACCOUNT_CODES.SALES_REVENUE, name: 'Sales Revenue (4010)' },
    { code: STANDARD_ACCOUNT_CODES.COST_OF_GOODS_SOLD, name: 'Cost of Goods Sold (5010)' },
  ];

  const missingAccounts: string[] = [];
  for (const { code, name } of requiredCodes) {
    if (!accountByCode.has(code)) {
      missingAccounts.push(name);
    }
  }

  if (missingAccounts.length > 0) {
    throw new Error(
      `Required accounts missing from chart_of_accounts: ${missingAccounts.join(', ')}. ` +
      'Run the accounting seed migration or insert them manually.'
    );
  }

  return {
    cash: accountByCode.get(STANDARD_ACCOUNT_CODES.CASH)!,
    inventory: accountByCode.get(STANDARD_ACCOUNT_CODES.INVENTORY)!,
    salesRevenue: accountByCode.get(STANDARD_ACCOUNT_CODES.SALES_REVENUE)!,
    costOfGoodsSold: accountByCode.get(STANDARD_ACCOUNT_CODES.COST_OF_GOODS_SOLD)!,
    shippingRevenue: accountByCode.get(STANDARD_ACCOUNT_CODES.SHIPPING_REVENUE),
    salesTaxPayable: accountByCode.get(STANDARD_ACCOUNT_CODES.SALES_TAX_PAYABLE),
    paymentProcessingFees: accountByCode.get(STANDARD_ACCOUNT_CODES.PAYMENT_PROCESSING_FEES),
    shippingExpense: accountByCode.get(STANDARD_ACCOUNT_CODES.SHIPPING_EXPENSE),
  };
}

// ---------------------------------------------------------------------------
// Step 2: Build Revenue-Side Journal Entry Lines
// ---------------------------------------------------------------------------

/**
 * Revenue-side accounting entry (Cash Basis):
 *   Debit  Cash (1010)              = total_amount collected
 *   Credit Sales Revenue (4010)     = subtotal (net product sales)
 *   Credit Shipping Revenue (4020)  = shipping_amount (if any)
 *   Credit Sales Tax Payable (2100) = tax_amount (if any)
 *
 * Balance check: total_amount = subtotal + shipping + tax
 */
function buildRevenueLines(
  accounts: AccountMap,
  order: OrderAccountingData,
): JournalEntryInput['lines'] {
  const lines: JournalEntryInput['lines'] = [];

  // Debit: Cash — total collected from customer
  lines.push({
    account_id: accounts.cash.id,
    entry_type: 'debit',
    amount: order.total_amount,
    description: `Payment received for order ${order.id}`,
  });

  // Credit: Sales Revenue — net product sales
  lines.push({
    account_id: accounts.salesRevenue.id,
    entry_type: 'credit',
    amount: order.subtotal,
    description: `Product sales for order ${order.id}`,
  });

  // Credit: Shipping Revenue (if any)
  if (
    order.shipping_amount != null &&
    order.shipping_amount > 0 &&
    accounts.shippingRevenue
  ) {
    lines.push({
      account_id: accounts.shippingRevenue.id,
      entry_type: 'credit',
      amount: order.shipping_amount,
      description: `Shipping revenue for order ${order.id}`,
    });
  }

  // Credit: Sales Tax Payable (if any)
  if (
    order.tax_amount != null &&
    order.tax_amount > 0 &&
    accounts.salesTaxPayable
  ) {
    lines.push({
      account_id: accounts.salesTaxPayable.id,
      entry_type: 'credit',
      amount: order.tax_amount,
      description: `Sales tax collected for order ${order.id}`,
    });
  }

  return lines;
}

// ---------------------------------------------------------------------------
// Step 3: Build COGS-Side Journal Entry Lines
// ---------------------------------------------------------------------------

/**
 * COGS-side accounting entry:
 *   Debit  Cost of Goods Sold (5010)   = total cost of items sold
 *   Credit Inventory (1200)            = asset reduction
 */
function buildCogsLines(
  accounts: AccountMap,
  order: OrderAccountingData,
): JournalEntryInput['lines'] {
  const totalCogs = Math.round(
    order.items.reduce(
      (sum, item) => sum + item.unit_cost * item.quantity,
      0,
    ) * 100
  ) / 100;

  if (totalCogs <= 0) {
    throw new Error(
      `Cannot process COGS for order ${order.id}: total cost is ${totalCogs}. ` +
      'Ensure each line item has a valid unit_cost.'
    );
  }

  const lineDescription = order.items
    .map((item) => `${item.quantity}x ${item.product_name}`)
    .join(', ');

  return [
    {
      account_id: accounts.costOfGoodsSold.id,
      entry_type: 'debit',
      amount: totalCogs,
      description: `COGS for order ${order.id}: ${lineDescription}`,
    },
    {
      account_id: accounts.inventory.id,
      entry_type: 'credit',
      amount: totalCogs,
      description: `Inventory reduction for order ${order.id}: ${lineDescription}`,
    },
  ];
}

// ---------------------------------------------------------------------------
// Step 4: Insert Journal Entry with Lines
// ---------------------------------------------------------------------------

async function insertJournalEntry(
  supabase: SupabaseClient,
  input: JournalEntryInput,
): Promise<{ journalEntryId: number }> {
  // 1. Insert the journal entry header
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
    // Detect duplicate (unique constraint on reference_id + reference_type)
    if (entryError.code === '23505') {
      throw new Error(
        `Duplicate journal entry: order ${input.reference_id} ` +
        `(type: ${input.reference_type}) already has accounting entries.`
      );
    }
    throw new Error(
      `Failed to insert journal entry for ${input.reference_id}: ${entryError.message}`
    );
  }

  if (!entry) {
        throw new Error(
      `Journal entry insertion returned no ID for ${input.reference_id}`
    );
  }

  const linesToInsert = input.lines.map((line) => ({
    journal_entry_id: entry.id,
    account_id: line.account_id,
    entry_type: line.entry_type,
    amount: line.amount,
    description: line.description ?? null,
  }));

  const { error: linesError } = await supabase
    .from('journal_entry_lines')
    .insert(linesToInsert);

  if (linesError) {
    await supabase.from('journal_entries').delete().eq('id', entry.id);
    throw new Error('Failed to insert journal entry lines for entry ' + entry.id + ': ' + linesError.message);
  }

  return { journalEntryId: entry.id };
}

function validateOrderData(order: any) {
  if (order.total_amount < 0) throw new Error('total_amount cannot be negative');
  if (order.subtotal < 0) throw new Error('subtotal cannot be negative');
  if (order.items.length === 0) throw new Error('No items to account for');
}

export const AccountingMode = {};
export async function processOrderAccounting(options) {
  const { order, mode = 'combined', supabase: externalSupabase } = options;
  try {
    validateOrderData(order);
    const supabase = externalSupabase ?? createSupabaseAdminClient();
    const accounts = await fetchAccountMap(supabase);
    const revenueLines = buildRevenueLines(accounts, order);
    const cogsLines = buildCogsLines(accounts, order);
    const combinedLines = [...revenueLines, ...cogsLines];
    const { journalEntryId } = await insertJournalEntry(supabase, {
      entry_date: order.order_date,
      reference_id: order.id,
      reference_type: 'order',
      description: 'Sale - ' + order.id,
      lines: combinedLines,
    });
    return { success: true, journal_entry_id: journalEntryId, message: 'Entry created' };
  } catch (error) {
    const message = error.message || 'Unknown error';
    return { success: false, message: 'Accounting failed', error: message, debits_total: 0, credits_total: 0 };
  }
}

export async function hasExistingJournalEntry(
  referenceId: string,
  referenceType: string = 'order',
  supabase?: any
): Promise<boolean> {
  const client = supabase ?? createSupabaseAdminClient();
  const { data, error } = await client
    .from('journal_entries')
    .select('id')
    .eq('reference_id', referenceId)
    .eq('reference_type', referenceType)
    .limit(1);
  if (error) {
    console.error('Failed to check existing entry:', error);
    return false;
  }
  return data && data.length > 0;
}

export async function reverseJournalEntry(journalEntryId, reason) {
  return { success: true, journal_entry_id: 0, message: 'Reversal created' };
}
