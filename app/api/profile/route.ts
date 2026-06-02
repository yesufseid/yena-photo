import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value;
    if (!userId) return NextResponse.json({ success: false, profile: null }, { status: 200 });

    const result = await sql`
      SELECT id, user_id, name, email, phone, photo, created_at
      FROM profiles
      WHERE user_id = ${userId}
    `;

    if (result.length === 0) {
      return NextResponse.json({ success: true, profile: null }, { status: 200 });
    }

    const profile = result[0] as any;
    if (profile.photo) {
      const photoResult = await sql`
        SELECT image_data FROM photos WHERE id = ${profile.photo}
      `;
      if (photoResult.length > 0) {
        const imageBuffer = photoResult[0].image_data as Buffer;
        profile.photo_data = imageBuffer.toString('base64');
      }
    }

    return NextResponse.json({ success: true, profile }, { status: 200 });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return NextResponse.json({ success: false, profile: null }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value;
    if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, email, phone, photo } = body as {
      name: string;
      email: string;
      phone?: string;
      photo?: string; // base64
    };

    let photoId: string | null = null;
    if (photo) {
      const buffer = Buffer.from(photo, 'base64');
      const photoInsert = await sql`
        INSERT INTO photos (image_data, created_at)
        VALUES (${buffer}, NOW())
        RETURNING id
      `;
      // Ensure photoId is a proper UUID string
      photoId = String(photoInsert[0].id);
    }

    // Upsert profile by user_id
    if (photoId) {
      await sql`
        INSERT INTO profiles (user_id, name, email, phone, photo, created_at)
        VALUES (${userId}, ${name}, ${email}, ${phone || null}, ${photoId}, NOW())
        ON CONFLICT (user_id) DO UPDATE
        SET name = EXCLUDED.name,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            photo = EXCLUDED.photo
      `;
    } else {
      await sql`
        INSERT INTO profiles (user_id, name, email, phone, created_at)
        VALUES (${userId}, ${name}, ${email}, ${phone || null}, NOW())
        ON CONFLICT (user_id) DO UPDATE
        SET name = EXCLUDED.name,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone
      `;
    }

    const updated = await sql`
      SELECT id, user_id, name, email, phone, photo, created_at
      FROM profiles
      WHERE user_id = ${userId}
    `;

    return NextResponse.json({ success: true, profile: updated[0] }, { status: 200 });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to update profile' }, { status: 500 });
  }
}

