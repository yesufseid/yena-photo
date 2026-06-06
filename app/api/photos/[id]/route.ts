import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Photo id is required' }, { status: 400 });
    }

    const result = await sql`
      SELECT id, image_data FROM photos WHERE id = ${id}
    `;

    if (!result || result.length === 0) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }

    const row = result[0] as { id: string; image_data: Buffer | Uint8Array | string };
    const imageBytes = Buffer.isBuffer(row.image_data)
      ? row.image_data
      : Buffer.from(row.image_data as Uint8Array | string);

    return new NextResponse(Uint8Array.from(imageBytes), {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Get photo error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to load photo' }, { status: 500 });
  }
}
