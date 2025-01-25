import connectToDatabase from '@/lib/db/mongoose';
import User from '@/lib/model/User';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const images: File[] = Array.from(
      formData.getAll('uploadImages')
    ) as File[];
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password') as string;
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const imageBase64Array: string[] = [];
    for (const image of images) {
      try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Import sharp dynamically only on the server
        const sharp = (await import('sharp')).default;

        // Resize and compress the image more aggressively
        const resizedBuffer = await sharp(buffer)
          .resize({ width: 800, height: 600, fit: 'inside' })
          .jpeg({ quality: 60 }) // Reduced quality for smaller file size
          .toBuffer();

        // Check if the base64 string would be too large (roughly 6MB)
        if (resizedBuffer.length > 6 * 1024 * 1024) {
          return NextResponse.json(
            { message: 'Image too large after compression' },
            { status: 400 }
          );
        }

        imageBase64Array.push(
          `data:image/jpeg;base64,${resizedBuffer.toString('base64')}`
        );
      } catch (imageError) {
        return NextResponse.json(
          { message: 'Error processing image' },
          { status: 400 }
        );
      }
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      images: imageBase64Array,
    });

    await newUser.save();

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}
