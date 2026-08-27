import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchContents } from '../api/contents';
import { groupContentByMonth } from '../utils/dateUtils';
import UpcomingTimeline from '../components/upcoming/UpcomingTimeline';
import MonthNav from '../components/upcoming/MonthNav';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import { Calendar, Film, Tv, Smile, Sparkles } from 'lucide-react';

export default function UpcomingPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [activeMonth, setActiveMonth] = useState(null);

  // Fetch upcoming contents chronologically across all months
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['contents', 'upcoming', selectedType],
    queryFn: () => fetchContents({
      contentType: selectedType === 'all' ? null : (selectedType === 'sitcom' ? 'series' : selectedType),
      upcomingOnly: true,
      sortBy: 'date_asc',
      page: 1,
      pageSize: 100 // Loads full timeline across all upcoming months
    }),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Client-side sitcom filter (TV Series with Comedy genre)
  const filteredItems = useMemo(() => {
    if (!data?.items) return [];
    if (selectedType === 'sitcom') {
      return data.items.filter((item) =>
        item.genres?.some((g) => g.name.toLowerCase().includes('comedy'))
      );
    }
    return data.items;
  }, [data, selectedType]);

  // Group items chronologically by Month & Year
  const monthGroups = useMemo(() => {
    return groupContentByMonth(filteredItems);
  }, [filteredItems]);

  // Smooth scroll handler for month navigation ribbon
  const handleScrollToMonth = (monthTitle) => {
    setActiveMonth(monthTitle);
    const elementId = `month-${monthTitle.replace(/\s+/g, '-').toLowerCase()}`;
    const targetElement = document.getElementById(elementId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-brand-card to-slate-950 p-8 md:p-12 border border-brand-border shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-accent/10 border border-brand-accent/30 px-3.5 py-1 text-xs font-bold text-brand-accent">
            <Calendar className="h-3.5 w-3.5" />
            Release Calendar & Launch Radar
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Upcoming Movies, Series & Sitcoms
          </h1>
          <p className="text-sm md:text-base text-brand-muted">
            Track exact theatrical and digital premiere dates, live countdowns, and upcoming releases across platforms.
          </p>
        </div>
      </section>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex flex-wrap items-center bg-brand-card p-1.5 rounded-2xl border border-brand-border">
          {[
            { id: 'all', label: 'All Releases', icon: Sparkles },
            { id: 'movie', label: 'Movies', icon: Film },
            { id: 'series', label: 'TV Series', icon: Tv },
            { id: 'sitcom', label: 'Sitcoms', icon: Smile },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = selectedType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedType(tab.id);
                  setActiveMonth(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-brand-accent text-white shadow-glow'
                    : 'text-brand-muted hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs font-medium text-brand-muted px-2">
          Found <span className="text-white font-bold">{filteredItems.length}</span> upcoming titles
        </div>
      </div>

      {/* Sticky Month Jump Ribbon */}
      <MonthNav
        months={monthGroups}
        activeMonth={activeMonth}
        onSelectMonth={handleScrollToMonth}
      />

      {/* Main Content Area */}
      {isLoading && <LoadingSkeleton count={6} />}

      {isError && (
        <ErrorState
          message={error?.response?.data?.detail || 'Failed to fetch release schedule.'}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && monthGroups.length === 0 && (
        <EmptyState
          title="No Upcoming Releases Found"
          description={`There are currently no scheduled ${selectedType === 'all' ? 'releases' : selectedType} in the database.`}
          onReset={() => setSelectedType('all')}
        />
      )}

      {!isLoading && !isError && monthGroups.length > 0 && (
        <UpcomingTimeline monthGroups={monthGroups} />
      )}
    </div>
  );
}