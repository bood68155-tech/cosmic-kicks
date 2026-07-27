import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    // Fetch entries with their lines and account details via proper Supabase FK join
    const { data: entries, error } = await supabase
      .from('journal_entries')
      .select(`
        *,
        lines:journal_entry_lines(
          id,
          entry_type,
          amount,
          description,
          account:chart_of_accounts(
            code,
            name
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    // Transform to add computed totals
    const transformed = (entries ?? []).map((entry: any) => {
      const lines = (entry.lines ?? []).map((line: any) => ({
        id: line.id,
        account_code: line.account?.code ?? '???',
        account_name: line.account?.name ?? 'Unknown',
        entry_type: line.entry_type,
        amount: Number(line.amount),
        description: line.description,
      }));

      const total_debits = lines
        .filter((l: any) => l.entry_type === 'debit')
        .reduce((s: number, l: any) => s + l.amount, 0);
      const total_credits = lines
        .filter((l: any) => l.entry_type === 'credit')
        .reduce((s: number, l: any) => s + l.amount, 0);

      return {
        ...entry,
        lines,
        total_debits: Math.round(total_debits * 100) / 100,
        total_credits: Math.round(total_credits * 100) / 100,
      };
    });

    return NextResponse.json({ success: true, entries: transformed });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
