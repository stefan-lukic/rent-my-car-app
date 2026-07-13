import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import connectToDatabase from '@/lib/db/mongoose';
import User from '@/lib/model/User';

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const formData = await request.formData();
    const images: File[] = Array.from(formData.getAll('image')) as File[];

    const imageBase64Array: string[] = [];

    for (const image of images) {
      try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const sharp = (await import('sharp')).default;

        const resizedBuffer = await sharp(buffer)
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
      } catch (imageError) {
        return NextResponse.json(
          { message: 'Error processing image' },
          { status: 400 }
        );
      }
    }

    const profileData = Object.fromEntries(formData);

    if (!profileData.name) {
      return NextResponse.json(
        { message: 'Name is required' },
        { status: 400 }
      );
    }

    const updateData = {
      name: profileData.name,
      contactInfo: profileData.contactInfo || '',
      ...(imageBase64Array.length > 0 && { images: imageBase64Array }),
    };

    const user = await User.findByIdAndUpdate(session.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { password, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating profile:', error);

    return NextResponse.json(
      { message: 'Error updating profile' },
      { status: 500 }
    );
  }
}
