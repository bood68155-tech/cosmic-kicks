// ===========================================================================
// types/accounting.ts
// TypeScript type definitions for the double-entry accounting engine.
// ===========================================================================

export type AccountCategory =
  | 'asset'
  | 'liability'
  | 'equity'
  | 'revenue'
  | 'expense';

export interface ChartOfAccount {
  id: number;
  code: string;
  name: string;
  type: AccountCategory;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccountMap {
  cash: ChartOfAccount;
  inventory: ChartOfAccount;
  salesRevenue: ChartOfAccount;
  costOfGoodsSold: ChartOfAccount;
  shippingRevenue?: ChartOfAccount;
  salesTaxPayable?: ChartOfAccount;
  paymentProcessingFees?: ChartOfAccount;
  shippingExpense?: ChartOfAccount;
}

export interface JournalEntryLineInput {
  account_id: number;
  entry_type: 'debit' | 'credit';
  amount: number;
  description?: string;
}

export interface JournalEntryInput {
  entry_date: string;
  reference_id: string;
  reference_type: string;
  description: string;
  lines: JournalEntryLineInput[];
}

export interface JournalEntry {
  id: number;
  entry_date: string;
  reference_id: string | null;
  reference_type: string;
  description: string;
  is_posted: boolean;
  posted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface JournalEntryLine {
  id: number;
  journal_entry_id: number;
  account_id: number;
  entry_type: 'debit' | 'credit';
  amount: number;
  description: string | null;
  created_at: string;
}

export interface OrderLineItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  unit_cost: number;
}

export interface OrderAccountingData {
  id: string;
  order_date: string;
  total_amount: number;
  subtotal: number;
  shipping_amount?: number;
  tax_amount?: number;
  payment_fee?: number;
  items: OrderLineItem[];
}

export interface AccountingResult {
  success: boolean;
  journal_entry_id?: number;
  revenue_entry_id?: number;
  cogs_entry_id?: number;
  message: string;
  error?: string;
  debits_total?: number;
  credits_total?: number;
}

export const STANDARD_ACCOUNT_CODES = {
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
