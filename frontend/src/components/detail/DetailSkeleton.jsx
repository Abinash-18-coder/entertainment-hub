export default function DetailSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      {/* Hero Skeleton */}
      <div className="relative h-96 w-full rounded-3xl bg-slate-900 border border-brand-border overflow-hidden flex items-end p-8">
        <div className="flex flex-col md:flex-row gap-6 w-full items-start md:items-end">
          <div className="h-64 w-44 rounded-2xl bg-slate-800 shrink-0" />
          <div className="space-y-3 w-full max-w-xl">
            <div className="h-4 w-28 bg-slate-800 rounded-md" />
            <div className="h-8 w-3/4 bg-slate-800 rounded-md" />
            <div className="h-4 w-full bg-slate-800 rounded-md" />
            <div className="h-4 w-2/3 bg-slate-800 rounded-md" />
          </div>
        </div>
      </div>

      {/* Watch Providers Skeleton */}
      <div className="h-24 w-full rounded-2xl bg-slate-900 border border-brand-border" />

      {/* Cast Grid Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-40 bg-slate-800 rounded-md" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-slate-900 border border-brand-border" />
          ))}
        </div>
      </div>
    </div>
  );
}