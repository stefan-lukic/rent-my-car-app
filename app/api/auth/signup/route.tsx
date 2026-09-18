import connectToDatabase from '@/lib/db/mongoose';
import User from '@/lib/model/User';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { generateVerificationToken } from '@/lib/emailVerification';
import { sendEmailVerification } from '@/lib/emailService/sendEmail';
import { isValidPhoneNumber, normalizePhoneNumber } from '@/lib/phoneNumber';
import {
  MAX_IMAGE_PIXELS,
  validateImageUploads,
} from '@/lib/imageUploadValidation';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 11000
  );
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageValidation = validateImageUploads(
      formData.getAll('uploadImages')
    );

    if (imageValidation.error) {
      return NextResponse.json(
        { message: imageValidation.error },
        { status: 400 }
      );
    }

    const images = imageValidation.files;
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password') as string;
    const phoneNumber = formData.get('phoneNumber');

    const nameStr = typeof name === 'string' ? name.trim() : '';
    const emailStr =
      typeof email === 'string' ? email.trim().toLowerCase() : '';
    const passwordStr = typeof password === 'string' ? password : '';
    const phoneNumberStr =
      typeof phoneNumber === 'string' ? phoneNumber.trim() : '';

    if (!nameStr || nameStr.length < 3) {
      return NextResponse.json(
        { message: 'Name must be at least 3 characters long' },
        { status: 400 }
      );
    }

    if (!emailStr || !isValidEmail(emailStr)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (!passwordStr || passwordStr.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (!phoneNumberStr || !isValidPhoneNumber(phoneNumberStr)) {
      return NextResponse.json(
        { message: 'A valid phone number is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email: emailStr });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(passwordStr, 10);

    const imageBase64Array: string[] = [];
    for (const image of images) {
      try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const sharp = (await import('sharp')).default;

        const resizedBuffer = await sharp(buffer, {
          limitInputPixels: MAX_IMAGE_PIXELS,
        })
          .resize({ width: 800, height: 600, fit: 'inside' })
          .jpeg({ quality: 60 })
          .toBuffer();

        if (resizedBuffer.length > 6 * 1024 * 1024) {
          return NextResponse.json(
            { message: 'Image too large after compression' },
            { status: 400 }
          );
        }

        imageBase64Array.push(
          `data:image/jpeg;base64,${resizedBuffer.toString('base64')}`
        );
      } catch {
        return NextResponse.json(
          { message: 'Error processing image' },
          { status: 400 }
        );
      }
    }

    const { rawToken, hash, expires } = generateVerificationToken();

    const newUser = new User({
      name: nameStr,
      email: emailStr,
      password: hashedPassword,
      contactInfo: normalizePhoneNumber(phoneNumberStr),
      images: imageBase64Array,
      emailVerificationToken: hash,
      emailVerificationExpires: expires,
    });

    await newUser.save();

    const appUrl = process.env.APP_URL;
    if (!appUrl) {
      await User.deleteOne({ _id: newUser._id });
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    try {
      await sendEmailVerification({
        email: newUser.email,
        token: rawToken,
        appUrl,
      });
    } catch (emailError) {
      console.error(
        'Failed to send verification email, rolling back user:',
        emailError
      );
      await User.deleteOne({ _id: newUser._id });
      return NextResponse.json(
        {
          message: 'Failed to send verification email. Please try again later.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Account created. Please verify your email.',
        requiresVerification: true,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (isDuplicateKeyError(error)) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}
