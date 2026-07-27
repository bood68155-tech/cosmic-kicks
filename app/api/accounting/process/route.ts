import { NextRequest, NextResponse } from 'next/server';
import {
  processOrderAccounting,
  hasExistingJournalEntry,
} from '@/lib/accounting/process-order';
import type { OrderAccountingData } from '@/types/accounting';

export async function POST(request: NextRequest) {
  try {
    const order: OrderAccountingData = await request.json();

    // Validate required fields
    if (!order.id || !order.items || order.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid order data: id and items are required' },
        { status: 400 },
      );
    }

    // Idempotency check: has this order already been processed?
    const alreadyProcessed = await hasExistingJournalEntry(order.id);
    if (alreadyProcessed) {
      return NextResponse.json(
        { success: true, message: `Order ${order.id} already has accounting entries` },
        { status: 200 },
      );
    }

    const result = await processOrderAccounting({
      order,
      mode: 'combined',
    });

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
