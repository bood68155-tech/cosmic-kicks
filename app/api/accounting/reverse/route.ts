import { NextRequest, NextResponse } from 'next/server';
import { reverseJournalEntry } from '@/lib/accounting/process-order';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { journal_entry_id, reason } = body;

    if (!journal_entry_id || !reason) {
      return NextResponse.json(
        { success: false, error: 'journal_entry_id and reason are required' },
        { status: 400 },
      );
    }

    const result = await reverseJournalEntry(
      Number(journal_entry_id),
      String(reason),
    );

    if (!result.success) {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
