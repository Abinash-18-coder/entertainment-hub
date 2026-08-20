export default function LoadingSkeleton({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className="flex flex-col rounded-xl bg-brand-card border border-brand-border overflow-hidden animate-pulse"
        >
          <div className="aspect-2/3 w-full bg-slate-800/60" />
          <div className="p-4 space-y-2">
            <div className="h-3 w-16 bg-slate-800 rounded" />
            <div className="h-4 w-full bg-slate-800 rounded" />
            <div className="flex gap-1 pt-2">
              <div className="h-3 w-12 bg-slate-800/80 rounded" />
              <div className="h-3 w-12 bg-slate-800/80 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}