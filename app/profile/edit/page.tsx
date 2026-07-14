import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import connectToDatabase from '@/lib/db/mongoose';
import User from '@/lib/model/User';
import EditProfileForm from '@/components/EditProfileForm';
import MobileEditProfileForm from '@/components/mobile/MobileEditProfileForm';
import { isMobileSSR } from '@/utils/deviceDetectionSSR';

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/sign-in?callbackUrl=/profile/edit');
  }

  await connectToDatabase();

  const user = await User.findById(session.user.id)
    .select('name email contactInfo images')
    .lean();

  if (!user) redirect('/sign-in');

  const initialProfile = {
    name: user.name || '',
    email: user.email,
    contactInfo: user.contactInfo || '',
    profileImage: user.images?.[0] || '',
  };

  const isMobile = isMobileSSR();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-xl">
        {isMobile ? (
          <MobileEditProfileForm initialProfile={initialProfile} />
        ) : (
          <EditProfileForm initialProfile={initialProfile} />
        )}
      </div>
    </main>
  );
}
