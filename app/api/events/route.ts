import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

function toBase64Image(imageData: string | null | undefined) {
  if (!imageData) return null;

  const normalized = imageData.includes(',') ? imageData.split(',')[1] : imageData;
  return Buffer.from(normalized, 'base64');
}

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

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const eventName = String(body?.eventName || '').trim();
    const eventDate = String(body?.eventDate || '').trim();
    const description = body?.description ? String(body.description) : null;
    const images = Array.isArray(body?.images) ? body.images : [];

    if (!eventName || !eventDate) {
      return NextResponse.json(
        { success: false, message: 'Event name and event date are required.' },
        { status: 400 }
      );
    }

    let coverPhotoId: string | null = null;
    const firstImage = images[0];

    if (firstImage) {
      const imageBuffer = toBase64Image(firstImage);
      if (imageBuffer) {
        const insertedPhoto = await sql`
          INSERT INTO photos (image_data, created_at)
          VALUES (${imageBuffer}, NOW())
          RETURNING id
        `;

        coverPhotoId = String(insertedPhoto[0]?.id ?? null);
      }
    }

    const insertedEvent = await sql`
      INSERT INTO events (user_id, name, event_date, description, cover_photo, created_at)
      VALUES (${userId}, ${eventName}, ${eventDate}, ${description}, ${coverPhotoId}, NOW())
      RETURNING id, user_id, name, event_date, description, cover_photo, created_at
    `;

    return NextResponse.json({ success: true, event: insertedEvent[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create event.' },
      { status: 500 }
    );
  }
}


