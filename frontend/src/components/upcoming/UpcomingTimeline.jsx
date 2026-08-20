import { Calendar } from 'lucide-react';
import UpcomingCard from '../ui/UpcomingCard';

export default function UpcomingTimeline({ monthGroups = [] }) {
  return (
    <div className="space-y-12">
      {monthGroups.map((group) => (
        <section
          key={group.title}
          id={`month-${group.title.replace(/\s+/g, '-').toLowerCase()}`}
          className="space-y-4 scroll-mt-28"
        >
          {/* Month Section Header */}
          <div className="flex items-center justify-between pb-2 border-b border-brand-border/80">
            <div className="flex items-center gap-2.5">
              <div className="h-3 w-3 rounded-full bg-brand-accent animate-pulse" />
              <h3 className="text-xl font-bold text-white tracking-wide">
                {group.title}
              </h3>
            </div>
            <span className="text-xs font-semibold text-brand-subtle bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
              {group.items.length} {group.items.length === 1 ? 'Release' : 'Releases'}
            </span>
          </div>

          {/* Cards Stack for This Month */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {group.items.map((item) => (
              <UpcomingCard key={item.id} content={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}