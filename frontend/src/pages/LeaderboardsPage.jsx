import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchContents, fetchGenres } from '../api/contents';
import LeaderboardList from '../components/leaderboards/LeaderboardList';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';
import { Trophy, Film, Tv, Smile } from 'lucide-react';

export default function LeaderboardsPage() {
  const [activeTab, setActiveTab] = useState('movies'); // 'movies' | 'series' | 'sitcoms'

  // 1. Fetch official genres list to look up the Comedy genre ID
  const { data: genres = [] } = useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenres,
    staleTime: 1000 * 60 * 30,
  });

  // Dynamically resolve Comedy genre ID for Sitcom filtering
  const comedyGenreId = useMemo(() => {
    const comedy = genres.find((g) => g.name.toLowerCase() === 'comedy');
    return comedy ? comedy.id : null;
  }, [genres]);

  // 2. Fetch Top Movies (sorted by rating)
  const {
    data: moviesData,
    isLoading: isLoadingMovies,
    isError: isMoviesError,
    refetch: refetchMovies
  } = useQuery({
    queryKey: ['contents', 'leaderboard', 'movies'],
    queryFn: () => fetchContents({
      contentType: 'movie',
      sortBy: 'rating',
      page: 1,
      pageSize: 50
    }),
    staleTime: 1000 * 60 * 10,
  });

  // 3. Fetch Top TV Series (sorted by rating)
  const {
    data: seriesData,
    isLoading: isLoadingSeries,
    isError: isSeriesError,
    refetch: refetchSeries
  } = useQuery({
    queryKey: ['contents', 'leaderboard', 'series'],
    queryFn: () => fetchContents({
      contentType: 'series',
      sortBy: 'rating',
      page: 1,
      pageSize: 50
    }),
    staleTime: 1000 * 60 * 10,
  });

  // 4. Fetch Top Sitcoms (TV series + Comedy genre ID)
  const {
    data: sitcomsData,
    isLoading: isLoadingSitcoms,
    isError: isSitcomsError,
    refetch: refetchSitcoms
  } = useQuery({
    queryKey: ['contents', 'leaderboard', 'sitcoms', comedyGenreId],
    queryFn: () => fetchContents({
      contentType: 'series',
      genreId: comedyGenreId,
      sortBy: 'rating',
      page: 1,
      pageSize: 50
    }),
    enabled: comedyGenreId !== undefined, // Runs once genres load
    staleTime: 1000 * 60 * 10,
  });

  const isLoading = isLoadingMovies || isLoadingSeries || (comedyGenreId && isLoadingSitcoms);
  const isError = isMoviesError || isSeriesError || isSitcomsError;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-brand-card to-slate-950 p-8 md:p-12 border border-brand-border shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 text-xs font-bold text-brand-gold">
            <Trophy className="h-3.5 w-3.5" />
            Official Hall of Fame
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            IMDb Rating Leaderboards
          </h1>
          <p className="text-sm md:text-base text-brand-muted">
            The highest rated entertainment titles of all time, ranked strictly by verified IMDb scores across 3 distinct categories.
          </p>
        </div>
      </section>

      {/* 3 Leaderboard Category Tabs */}
      <div className="flex flex-wrap items-center bg-brand-card p-1.5 rounded-2xl border border-brand-border w-fit gap-1">
        {[
          {
            id: 'movies',
            label: 'Top Movies',
            icon: Film,
            count: moviesData?.items?.length || 0
          },
          {
            id: 'series',
            label: 'Top TV Series',
            icon: Tv,
            count: seriesData?.items?.length || 0
          },
          {
            id: 'sitcoms',
            label: 'Top Sitcoms',
            icon: Smile,
            count: sitcomsData?.items?.length || 0
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                active
                  ? 'bg-brand-accent text-white shadow-glow'
                  : 'text-brand-muted hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${active ? 'bg-black/30' : 'bg-slate-800'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Leaderboard Render Views */}
      {isLoading && <LoadingSkeleton count={6} />}

      {isError && (
        <ErrorState
          message="Failed to load IMDb leaderboards from the server."
          onRetry={() => {
            refetchMovies();
            refetchSeries();
            refetchSitcoms();
          }}
        />
      )}

      {!isLoading && !isError && activeTab === 'movies' && (
        <LeaderboardList
          items={moviesData?.items || []}
          title="Top Rated Movies"
          description="Highest rated cinematic feature films ranked by IMDb score."
        />
      )}

      {!isLoading && !isError && activeTab === 'series' && (
        <LeaderboardList
          items={seriesData?.items || []}
          title="Top Rated TV Series"
          description="Critically acclaimed television dramas and mini-series."
        />
      )}

      {!isLoading && !isError && activeTab === 'sitcoms' && (
        <LeaderboardList
          items={sitcomsData?.items || []}
          title="Top Rated Sitcoms & Comedy Series"
          description="Top ranked situational comedies and comedy shows (TV Series + Comedy Genre)."
        />
      )}
    </div>
  );
}