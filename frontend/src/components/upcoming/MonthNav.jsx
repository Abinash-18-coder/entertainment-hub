import { CalendarDays } from 'lucide-react';

export default function MonthNav({ months = [], activeMonth, onSelectMonth }) {
  if (months.length <= 1) return null;

  return (
    <div className="sticky top-16 z-30 flex items-center gap-2 overflow-x-auto py-3 bg-brand-dark/95 backdrop-blur-md border-b border-brand-border scrollbar-none">
      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-subtle pl-1 pr-2 shrink-0">
        <CalendarDays className="h-4 w-4 text-brand-accent" />
        Jump To:
      </span>
      {months.map((month) => {
        const isActive = activeMonth === month.title;
        return (
          <button
            key={month.title}
            onClick={() => onSelectMonth(month.title)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              isActive
                ? 'bg-brand-accent text-white shadow-glow'
                : 'bg-brand-card text-brand-muted hover:text-white border border-brand-border'
            }`}
          >
            {month.title}
            <span className="ml-1.5 text-[10px] opacity-75">
              ({month.items.length})
            </span>
          </button>
        );
      })}
    </div>
  );
}