import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import connectToDatabase from '@/lib/db/mongoose';
import { hashToken } from '@/lib/emailVerification';
import User from '@/lib/model/User';

const resetPasswordSchema = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/i),
  password: z.string().min(8).max(128),
});

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: 'Invalid request.' },
        { status: 400 }
      );
    }

    const parsedBody = resetPasswordSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { message: 'Invalid token or password.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const password = await bcrypt.hash(parsedBody.data.password, 10);
    const passwordResetToken = hashToken(parsedBody.data.token);

    const user = await User.findOneAndUpdate(
      {
        passwordResetToken,
        passwordResetExpires: { $gt: new Date() },
      },
      {
        $set: { password },
        $unset: { passwordResetToken: 1, passwordResetExpires: 1 },
        // Revoke existing sessions in the same atomic password update.
        $inc: { sessionVersion: 1 },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { message: 'This password reset link is invalid or has expired.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Password reset failed:', error);
    return NextResponse.json(
      { message: 'Unable to reset password right now.' },
      { status: 500 }
    );
  }
}
