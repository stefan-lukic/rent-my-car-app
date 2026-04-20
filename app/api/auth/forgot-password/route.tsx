import connectToDatabase from '@/lib/db/mongoose'; // funkcija koja otvara konekciju ka MongoDB bazi

import User from '@/lib/model/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          message: 'User does not exist.',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: 'Password reset link has been sent to your email.',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
