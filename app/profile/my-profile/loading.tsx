export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50">
      {/* header skeleton */}
      <div className="bg-blue-600 rounded-xl p-7 mb-6 flex items-center gap-5">
        <div className="w-18 h-18 rounded-full bg-blue-400 animate-pulse min-w-[72px] min-h-[72px]" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-4 w-40 bg-blue-400 rounded animate-pulse" />
          <div className="h-3 w-56 bg-blue-400 rounded animate-pulse" />
          <div className="h-3 w-36 bg-blue-400 rounded animate-pulse" />
        </div>
        <div className="h-9 w-28 bg-blue-400 rounded-lg animate-pulse" />
      </div>

      {/* my cars skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border border-gray-100 rounded-xl overflow-hidden"
          >
            <div className="h-40 bg-gray-200 animate-pulse" />
            <div className="p-3 flex flex-col gap-2">
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-2 mt-1">
                <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse" />
                <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* my rentals skeleton */}
      <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="flex flex-col gap-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="border border-gray-100 rounded-xl p-4 flex gap-4 items-center"
          >
            <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse min-w-[64px]" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
