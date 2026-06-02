import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const result = await sql`
      SELECT id, image_data FROM photos WHERE id = ${id}
    `;

    if (!result || result.length === 0) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }

    const row = result[0] as any;
    const data: Buffer = row.image_data;
    const base64 = Buffer.from(data).toString('base64');

    return NextResponse.json({ success: true, id: row.id, data: base64 }, { status: 200 });
  } catch (error: any) {
    console.error('Get photo error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to load photo' }, { status: 500 });
  }
}
