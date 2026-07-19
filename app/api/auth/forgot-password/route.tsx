import connectToDatabase from '@/lib/db/mongoose'; // funkcija koja otvara konekciju ka MongoDB bazi

import User from '@/lib/model/User';
import { NextRequest, NextResponse } from 'next/server';
import { generateVerificationToken } from '@/lib/emailVerification';
import { sendPasswordResetEmail } from '@/lib/emailService/sendEmail';

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
        { status: 400 }
      );
    }

    const appUrl = process.env.APP_URL;
    if (!appUrl) {
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    const { rawToken, hash, expires } = generateVerificationToken();

    user.passwordResetToken = hash;
    user.passwordResetExpires = expires;
    await user.save();

    try {
      await sendPasswordResetEmail({
        email: user.email,
        token: rawToken,
        appUrl,
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      return NextResponse.json(
        { message: 'Failed to send reset email. Please try again later.' },
        { status: 500 }
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
