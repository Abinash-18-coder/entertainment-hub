import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchContents } from '../api/contents';
import MovieCard from '../components/ui/MovieCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';
import RecommendationsRow from '../components/recommendations/RecommendationsRow';
import { Flame, Film, Tv, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [selectedType, setSelectedType] = useState('all');

  // React Query Fetcher Hook
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['contents', 'featured', selectedType],
    queryFn: () =>
      fetchContents({
        contentType: selectedType === 'all' ? null : selectedType,
        sortBy: 'rating',
        page: 1,
        pageSize: 15,
      }),
    staleTime: 1000 * 60 * 5, // Cache data in memory for 5 minutes
  });

  return (
    <div className="space-y-12">
      {/* Hero Section Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-brand-card to-slate-950 p-8 md:p-14 border border-brand-border shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-accent/10 border border-brand-accent/30 px-3.5 py-1 text-xs font-semibold text-brand-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Next-Gen Entertainment Explorer
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Discover Upcoming Releases, Ratings & Streaming Sources.
          </h1>

          <p className="text-sm md:text-base text-brand-muted">
            Direct redirects to Netflix, Prime Video, and Disney+ Hotstar
            alongside verified IMDb ratings and complete cast billing.
          </p>
        </div>

        {/* Decorative backdrop glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-brand-accent/10 blur-3xl pointer-events-none" />
      </section>

      {/* Personalized Recommendations Section */}
      <RecommendationsRow />

      {/* Main Catalog & Filter Toolbar */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-brand-accent" />

            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
              Top Ranked Titles
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-brand-card p-1 rounded-xl border border-brand-border">
            {[
              { id: 'all', label: 'All', icon: Sparkles },
              { id: 'movie', label: 'Movies', icon: Film },
              { id: 'series', label: 'TV Series', icon: Tv },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = selectedType === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedType(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
        </div>

        {/* Content Display States */}
        {isLoading && <LoadingSkeleton count={10} />}

        {isError && (
          <ErrorState
            message={
              error?.response?.data?.detail ||
              'Could not connect to FastAPI server. Ensure the backend is running.'
            }
            onRetry={() => refetch()}
          />
        )}

        {data && data.items && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {data.items.map((item) => (
              <MovieCard key={item.id} content={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}