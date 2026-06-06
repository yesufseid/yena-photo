import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/auth-service';

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, user: null },
        { status: 200 }
      );
    }

    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, user: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, user },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Session error:', error);
    return NextResponse.json(
      { success: false, user: null },
      { status: 200 }
    );
  }
}
