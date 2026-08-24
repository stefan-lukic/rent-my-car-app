import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import connectToDatabase from '@/lib/db/mongoose';
import {
  generateVerificationToken,
  PASSWORD_RESET_EXPIRATION_MS,
} from '@/lib/emailVerification';
import { sendPasswordResetEmail } from '@/lib/emailService/sendEmail';
import User from '@/lib/model/User';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((email) => email.toLowerCase()),
});

const genericSuccessMessage =
  'If an account exists for this email, a password reset link has been sent.';

export async function POST(req: NextRequest) {
  try {
    const appUrl = process.env.APP_URL;
    if (!appUrl) {
      console.error('APP_URL is not configured for password reset emails.');
      return NextResponse.json(
        { message: 'Unable to process password reset right now.' },
        { status: 500 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: 'Invalid request.' },
        { status: 400 }
      );
    }

    const parsedBody = forgotPasswordSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email: parsedBody.data.email });
    if (!user) {
      return NextResponse.json({ message: genericSuccessMessage });
    }

    const { rawToken, hash, expires } = generateVerificationToken(
      PASSWORD_RESET_EXPIRATION_MS
    );

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          passwordResetToken: hash,
          passwordResetExpires: expires,
        },
      }
    );

    try {
      await sendPasswordResetEmail({
        email: user.email,
        token: rawToken,
        appUrl,
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);

      // Remove only this request's token because a newer request may replace it.
      await User.updateOne(
        { _id: user._id, passwordResetToken: hash },
        { $unset: { passwordResetToken: 1, passwordResetExpires: 1 } }
      );
    }

    return NextResponse.json({ message: genericSuccessMessage });
  } catch (error) {
    console.error('Forgot password request failed:', error);
    return NextResponse.json(
      { message: 'Unable to process password reset right now.' },
      { status: 500 }
    );
  }
}
