-- ============================================================================
-- Migration 00001: Accounting Tables (Double-Entry Bookkeeping Engine)
-- ============================================================================

-- 1. chart_of_accounts
CREATE TABLE IF NOT EXISTS public.chart_of_accounts (
  id          BIGSERIAL    PRIMARY KEY,
  code        VARCHAR(10)  NOT NULL UNIQUE,
  name        VARCHAR(255) NOT NULL,
  type        VARCHAR(50)  NOT NULL
    CHECK (type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  description TEXT,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 2. journal_entries
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id             BIGSERIAL    PRIMARY KEY,
  entry_date     DATE         NOT NULL DEFAULT CURRENT_DATE,
  reference_id   TEXT,
  reference_type VARCHAR(50)  NOT NULL DEFAULT 'order',
  description    TEXT         NOT NULL,
  is_posted      BOOLEAN      NOT NULL DEFAULT TRUE,
  posted_at      TIMESTAMPTZ  DEFAULT now(),
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Unique constraint for idempotency
ALTER TABLE public.journal_entries
  ADD CONSTRAINT uq_journal_entries_reference
  UNIQUE (reference_id, reference_type);

CREATE INDEX idx_journal_entries_reference
  ON public.journal_entries(reference_type, reference_id);

CREATE INDEX idx_journal_entries_date
  ON public.journal_entries(entry_date);

-- 3. journal_entry_lines
CREATE TABLE IF NOT EXISTS public.journal_entry_lines (
  id               BIGSERIAL   PRIMARY KEY,
  journal_entry_id BIGINT      NOT NULL
    REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  account_id       BIGINT      NOT NULL
    REFERENCES public.chart_of_accounts(id) ON DELETE RESTRICT,
  entry_type       VARCHAR(6)  NOT NULL
    CHECK (entry_type IN ('debit', 'credit')),
  amount           NUMERIC(12,2) NOT NULL
    CHECK (amount >= 0),
  description      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_jel_journal_entry
  ON public.journal_entry_lines(journal_entry_id);

CREATE INDEX idx_jel_account
  ON public.journal_entry_lines(account_id);

-- 4. Row-Level Security
ALTER TABLE public.chart_of_accounts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entry_lines   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read chart_of_accounts"
  ON public.chart_of_accounts FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "Authenticated users can insert chart_of_accounts"
  ON public.chart_of_accounts FOR INSERT TO authenticated WITH CHECK (TRUE);

CREATE POLICY "Authenticated users can update chart_of_accounts"
  ON public.chart_of_accounts FOR UPDATE TO authenticated USING (TRUE);

CREATE POLICY "Authenticated users can read journal_entries"
  ON public.journal_entries FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "Authenticated users can insert journal_entries"
  ON public.journal_entries FOR INSERT TO authenticated WITH CHECK (TRUE);

CREATE POLICY "Authenticated users can read journal_entry_lines"
  ON public.journal_entry_lines FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "Authenticated users can insert journal_entry_lines"
  ON public.journal_entry_lines FOR INSERT TO authenticated WITH CHECK (TRUE);

-- 5. Seed Standard Chart of Accounts
INSERT INTO public.chart_of_accounts (code, name, type, description) VALUES
  ('1010', 'Cash',                    'asset',    'Cash in the business bank account'),
  ('1200', 'Inventory',               'asset',    'Goods available for sale in stock'),
  ('2100', 'Sales Tax Payable',       'liability','Sales tax collected, payable to tax authorities'),
  ('3010', 'Retained Earnings',       'equity',   'Accumulated retained earnings'),
  ('4010', 'Sales Revenue',           'revenue',  'Revenue from sale of goods'),
  ('4020', 'Shipping Revenue',        'revenue',  'Revenue collected for shipping'),
  ('5010', 'Cost of Goods Sold',      'expense',  'Direct cost of goods sold'),
  ('5020', 'Payment Processing Fees', 'expense',  'Fees from payment processors (Stripe, etc.)'),
  ('5030', 'Shipping Expense',        'expense',  'Shipping costs paid to carriers')
ON CONFLICT (code) DO NOTHING;

-- 6. Verify balance query (run periodically to check integrity)
-- SELECT je.id, je.reference_id,
--   SUM(CASE WHEN jel.entry_type = 'debit' THEN jel.amount ELSE 0 END) as total_debits,
--   SUM(CASE WHEN jel.entry_type = 'credit' THEN jel.amount ELSE 0 END) as total_credits
-- FROM journal_entries je
-- JOIN journal_entry_lines jel ON jel.journal_entry_id = je.id
-- GROUP BY je.id
-- HAVING SUM(CASE WHEN jel.entry_type = 'debit' THEN jel.amount ELSE 0 END)
--      <> SUM(CASE WHEN jel.entry_type = 'credit' THEN jel.amount ELSE 0 END);
