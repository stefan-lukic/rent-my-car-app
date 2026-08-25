import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import connectToDatabase from '@/lib/db/mongoose';
import User from '@/lib/model/User';
import EditProfileForm from '@/components/EditProfileForm';
import Header from '@/components/UI/Header';

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

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
      <div className="hidden md:block">
        <Header />
      </div>
      <EditProfileForm initialProfile={initialProfile} />
    </div>
  );
}
