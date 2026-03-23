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
          message:
            'If this email exists, you will receive a reset link shortly.',
        },
        { status: 200 }
      );
    }

    //console.log(`Password reset requested for: ${email}`);

    return NextResponse.json(
      {
        message: 'If this email exists, you will receive a reset link shortly.',
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
