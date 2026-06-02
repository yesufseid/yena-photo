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

    // For each event with cover_photo, fetch the image data
    const eventsWithImages = await Promise.all(
      events.map(async (event: any) => {
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
              };
            }
          } catch (err) {
            console.error('Failed to fetch photo:', err);
          }
        }
        return event;
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
    const body = await request.json();
    const { eventName, eventDate, description, images } = body as {
      eventName: string;
      eventDate?: string;
      description?: string;
      images: string[]; // base64 strings
    };

    const userId = request.cookies.get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!eventName || !images || images.length === 0) {
      return NextResponse.json({ success: false, message: 'Missing eventName or images' }, { status: 400 });
    }

    // Insert event
    const eventInsert = await sql`
      INSERT INTO events (user_id, name, event_date, description, created_at)
      VALUES (${userId}, ${eventName}, ${eventDate || null}, ${description || null}, NOW())
      RETURNING id
    `;

    const eventId = eventInsert[0].id as string;

    const savedPhotos: { id: string }[] = [];

    for (const base64 of images) {
      const buffer = Buffer.from(base64, 'base64');

      const photoInsert = await sql`
        INSERT INTO photos (image_data, created_at)
        VALUES (${buffer}, NOW())
        RETURNING id
      `;

      const photoId = photoInsert[0].id as string;
      savedPhotos.push({ id: photoId });

      // Set cover photo to first uploaded photo
      if (savedPhotos.length === 1) {
        await sql`
          UPDATE events
          SET cover_photo = ${photoId}
          WHERE id = ${eventId}
        `;
      }
    }

    // Fetch the created event with photo data
    const createdEvent = await sql`
      SELECT id, user_id, name, event_date, description, cover_photo, created_at
      FROM events
      WHERE id = ${eventId}
    `;

    let eventData = createdEvent[0];
    if (eventData.cover_photo) {
      const photoResult = await sql`
        SELECT image_data FROM photos WHERE id = ${eventData.cover_photo}
      `;
      if (photoResult.length > 0) {
        const imageBuffer = photoResult[0].image_data as Buffer;
        eventData = { ...eventData, cover_photo_data: imageBuffer.toString('base64') };
      }
    }

    return NextResponse.json({ success: true, event: eventData }, { status: 201 });
  } catch (error: any) {
    console.error('Create event error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create event' }, { status: 500 });
  }
}
