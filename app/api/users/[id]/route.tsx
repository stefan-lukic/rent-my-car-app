import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import User from '@/lib/model/User';
import { PUBLIC_USER_PROFILE_PROJECTION } from '@/lib/profileAccess';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: 'User ID is required' },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    // Positive projection prevents private fields from ever entering the
    // response object, even when new sensitive User fields are added later.
    const user = await User.findById(id)
      .select(PUBLIC_USER_PROFILE_PROJECTION)
      .lean();

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching public user profile:', error);
    return NextResponse.json(
      { message: 'Error fetching user data' },
      { status: 500 }
    );
  }
}
