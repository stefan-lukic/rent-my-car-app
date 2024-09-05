import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto py-20">
      <div className="flex flex-col h-[500px] justify-center items-center gap-10">
        <h1 className="text-8xl font-medium">404 Not Found</h1>

        <p className="">Your visited page not found. You may go home page.</p>

        <Link
          href="/"
          className="px-12 py-4 mt-8 rounded-md bg-[var(--button)] text-white"
        >
          Back to home page
        </Link>
      </div>
    </div>
  );
}
