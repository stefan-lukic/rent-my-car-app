import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/db/mongoose';
import User from '@/lib/model/User';

async function getOwner(id: string) {
  await connectToDatabase();
  const user = await User.findById(id).lean();
  if (!user) return null;
  const { password, ...userWithoutPassword } = user as any;
  return userWithoutPassword;
}

export default async function OwnerProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const owner = await getOwner(params.id);

  if (!owner) notFound();

  return (
    <div className="min-h-screen bg-white py-12 px-4 text-slate-800">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Catalog
        </Link>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-100">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
            <Image
              src={owner.images?.[0] || '/placeholder-car.svg'}
              alt={owner.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{owner.name}</h1>
            <p className="text-sm text-slate-500">{owner.email}</p>
            {owner.contactInfo && (
              <p className="text-sm text-slate-500">{owner.contactInfo}</p>
            )}
            {owner.rating !== undefined && (
              <div className="flex items-center justify-center sm:justify-start gap-1 text-sm font-semibold text-slate-700">
                <svg
                  className="w-4 h-4 text-amber-500 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{Number(owner.rating).toFixed(1)} / 5.0</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
