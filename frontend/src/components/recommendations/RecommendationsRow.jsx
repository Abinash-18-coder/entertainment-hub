import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { fetchRecommendations } from '../../api/library';
import MovieCard from '../ui/MovieCard';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import { Sparkles, Compass } from 'lucide-react';

export default function RecommendationsRow() {
  const { isAuthenticated } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['library', 'recommendations'],
    queryFn: fetchRecommendations,
    enabled: isAuthenticated, // Only execute query if user is signed in
    staleTime: 1000 * 60 * 10, // 10-minute cache
  });

  if (!isAuthenticated || isError) return null;

  const items = data?.items || [];
  if (!isLoading && items.length === 0) return null;

  return (
    <section className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-brand-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/20 border border-brand-accent/40 text-brand-accent shadow-glow">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
              Recommended For You
            </h2>
            <p className="text-xs text-brand-muted">
              Tailored suggestions matching your genres and watched history
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-brand-muted border border-slate-700">
          <Compass className="h-3.5 w-3.5 text-brand-accent" />
          Personalized Feed
        </span>
      </div>

      {/* Row Render */}
      {isLoading ? (
        <LoadingSkeleton count={5} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {items.slice(0, 5).map((item) => (
            <MovieCard key={item.id} content={item} />
          ))}
        </div>
      )}
    </section>
  );
}