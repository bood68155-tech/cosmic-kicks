import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    // Fetch all active accounts
    const { data: accounts, error: accountsError } = await supabase
      .from('chart_of_accounts')
      .select('*')
      .eq('is_active', true)
      .order('code', { ascending: true });

    if (accountsError) {
      return NextResponse.json(
        { success: false, error: accountsError.message },
        { status: 500 },
      );
    }

    if (!accounts || accounts.length === 0) {
      return NextResponse.json({
        success: true,
        accounts: [],
        message: 'No accounts found. Run the database migration first.',
      });
    }

    // Compute totals from posted journal entry lines
    const accountIds = accounts.map((a: any) => a.id);

    const { data: lines, error: linesError } = await supabase
      .from('journal_entry_lines')
      .select(`
        account_id,
        entry_type,
        amount
      `)
      .in('account_id', accountIds);

    if (linesError) {
      return NextResponse.json(
        { success: false, error: linesError.message },
        { status: 500 },
      );
    }

    // Build account summaries with running balances
    const lineMap = new Map<number, { debits: number; credits: number }>();
    for (const line of lines ?? []) {
      const entry = lineMap.get(line.account_id) ?? { debits: 0, credits: 0 };
      if (line.entry_type === 'debit') {
        entry.debits += Number(line.amount);
      } else {
        entry.credits += Number(line.amount);
      }
      lineMap.set(line.account_id, entry);
    }

    const accountSummaries = accounts.map((account: any) => {
      const totals = lineMap.get(account.id) ?? { debits: 0, credits: 0 };

      // Balance calculation based on account type
      // Assets and Expenses: normal debit balance (debits - credits)
      // Liabilities, Equity, Revenue: normal credit balance (credits - debits)
      let balance: number;
      if (account.type === 'asset' || account.type === 'expense') {
        balance = totals.debits - totals.credits;
      } else {
        balance = totals.credits - totals.debits;
      }

      return {
        id: account.id,
        code: account.code,
        name: account.name,
        type: account.type,
        total_debits: totals.debits,
        total_credits: totals.credits,
        balance: Math.round(balance * 100) / 100,
      };
    });

    return NextResponse.json({ success: true, accounts: accountSummaries });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
