// app/api/connections/route.ts
import { NextResponse } from 'next/server';
import { buildGroup } from '@/app/components/lib/groupFactory';

export async function GET() {
  try {
    const [easy, medium, hard, extreme] = await Promise.all([
      buildGroup('easy'),
      buildGroup('medium'),
      buildGroup('hard'),
      buildGroup('extreme'),
    ]);

    return NextResponse.json({ groups: [easy, medium, hard, extreme] });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Could not create puzzle' },
      { status: 500 }
    );
  }
}
