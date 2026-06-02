import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ success: false, events: [] }, { status: 200 });
    }

    const events = await sql`
      SELECT id, user_id, name, event_date, description, cover_photo, created_at
      FROM events
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    // For each event with cover_photo, fetch the image data and count photos
    const eventsWithImages = await Promise.all(
      events.map(async (event: any) => {
        let photoCount = undefined;

        try {
          const countResult = await sql`
            SELECT COUNT(*)::int AS count FROM photos WHERE event_id = ${event.id}
          `;
          if (countResult.length > 0) {
            photoCount = Number(countResult[0].count);
          }
        } catch (err) {
          // If the photos table does not support event_id, ignore and continue.
        }

        if (event.cover_photo) {
          try {
            const photoResult = await sql`
              SELECT image_data FROM photos WHERE id = ${event.cover_photo}
            `;
            if (photoResult.length > 0) {
              const imageBuffer = photoResult[0].image_data as Buffer;
              return {
                ...event,
                cover_photo_data: imageBuffer.toString('base64'),
                photoCount,
              };
            }
          } catch (err) {
            console.error('Failed to fetch photo:', err);
          }
        }

        return {
          ...event,
          photoCount,
        };
      })
    );

    return NextResponse.json({ success: true, events: eventsWithImages }, { status: 200 });
  } catch (error: any) {
    console.error('Get events error:', error);
    return NextResponse.json({ success: false, events: [], message: error.message }, { status: 500 });
  }
}


