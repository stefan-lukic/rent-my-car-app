import l from '@/helper/en';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto py-20">
      <div className="flex flex-col h-[500px] justify-center items-center gap-10">
        <h1 className="text-8xl font-medium">{l.pages.notFound}</h1>

        <p className="">{l.pages.pageNotFound}</p>

        <Link
          href="/"
          className="px-12 py-4 mt-8 rounded-md bg-[var(--button)] text-white"
        >
          {l.common.backToHome}
        </Link>
      </div>
    </div>
  );
}
