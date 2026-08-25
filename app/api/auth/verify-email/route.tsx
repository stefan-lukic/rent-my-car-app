import connectToDatabase from '@/lib/db/mongoose';
import User from '@/lib/model/User';
import { NextRequest, NextResponse } from 'next/server';
import { hashToken } from '@/lib/emailVerification';

function isHexHash(token: string): boolean {
  return /^[a-f0-9]{64}$/i.test(token);
}

export async function POST(req: NextRequest) {
  try {
    let body: { token?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    const token = body?.token;

    if (!token || typeof token !== 'string' || !isHexHash(token)) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    await connectToDatabase();

    const hashedToken = hashToken(token);

    const user = await User.findOneAndUpdate(
      {
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $gt: new Date() },
      },
      {
        $set: { emailVerified: new Date() },
        $unset: { emailVerificationToken: 1, emailVerificationExpires: 1 },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification failed:', error);
    return NextResponse.json(
      { message: 'Unable to verify email right now' },
      { status: 500 }
    );
  }
}
