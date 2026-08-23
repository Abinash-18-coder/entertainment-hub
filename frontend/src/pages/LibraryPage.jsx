import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchUserBookmarks, fetchUserWatched, toggleBookmark, toggleWatched } from '../api/library';
import MovieCard from '../components/ui/MovieCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { Bookmark, CheckCircle, Sparkles, Tv, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LibraryPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookmarks'); // 'bookmarks' | 'watched'
  const queryClient = useQueryClient();

  // 1. Fetch Bookmarks
  const {
    data: bookmarksData,
    isLoading: isLoadingBookmarks,
    refetch: refetchBookmarks
  } = useQuery({
    queryKey: ['library', 'bookmarks'],
    queryFn: fetchUserBookmarks,
    staleTime: 1000 * 60 * 5,
  });

  // 2. Fetch Watched List
  const {
    data: watchedData,
    isLoading: isLoadingWatched,
    refetch: refetchWatched
  } = useQuery({
    queryKey: ['library', 'watched'],
    queryFn: fetchUserWatched,
    staleTime: 1000 * 60 * 5,
  });

  // Remove mutations
  const removeBookmarkMutation = useMutation({
    mutationFn: (contentId) => toggleBookmark(contentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['library', 'bookmarks'] }),
  });

  const removeWatchedMutation = useMutation({
    mutationFn: (contentId) => toggleWatched(contentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['library', 'watched'] }),
  });

  const bookmarks = bookmarksData?.items || [];
  const watched = watchedData?.items || [];
  const activeItems = activeTab === 'bookmarks' ? bookmarks : watched;
  const isLoading = activeTab === 'bookmarks' ? isLoadingBookmarks : isLoadingWatched;

  // Group streaming availability across saved bookmarks
  const platformSummary = useMemo(() => {
    const counts = {};
    bookmarks.forEach((item) => {
      const providers = item.watch_providers?.providers || [];
      providers.forEach((p) => {
        counts[p.name] = (counts[p.name] || 0) + 1;
      });
    });
    return Object.entries(counts);
  }, [bookmarks]);

  return (
    <div className="space-y-8 pb-16">
      {/* Profile Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-brand-card to-slate-950 p-8 md:p-12 border border-brand-border shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-accent shadow-glow text-white font-black text-2xl">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 mb-1">
                <CheckCircle className="h-3 w-3" />
                Active Member
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                {user?.email}
              </h1>
              <p className="text-xs text-brand-muted mt-0.5">
                Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '2026'}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="block text-[11px] text-brand-subtle font-medium">Bookmarked</span>
              <span className="text-sm font-bold text-brand-accent">{bookmarks.length} Titles</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="block text-[11px] text-brand-subtle font-medium">Completed</span>
              <span className="text-sm font-bold text-emerald-400">{watched.length} Titles</span>
            </div>
          </div>
        </div>
      </section>

      {/* Streaming Platform Summary Widget (Bonus UX Feature) */}
      {platformSummary.length > 0 && activeTab === 'bookmarks' && (
        <div className="p-4 rounded-2xl bg-brand-card/80 border border-brand-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Tv className="h-4 w-4 text-brand-accent" />
            <span>Where to stream your Watchlist:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {platformSummary.slice(0, 4).map(([name, count]) => (
              <span key={name} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-brand-muted">
                {name}: <strong className="text-white">{count}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center bg-brand-card p-1.5 rounded-2xl border border-brand-border w-fit gap-1">
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bookmarks'
              ? 'bg-brand-accent text-white shadow-glow'
              : 'text-brand-muted hover:text-white'
          }`}
        >
          <Bookmark className="h-4 w-4" />
          My Bookmarks ({bookmarks.length})
        </button>

        <button
          onClick={() => setActiveTab('watched')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'watched'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-brand-muted hover:text-white'
          }`}
        >
          <CheckCircle className="h-4 w-4" />
          Already Watched ({watched.length})
        </button>
      </div>

      {/* Grid Content Display */}
      {isLoading && <LoadingSkeleton count={5} />}

      {!isLoading && activeItems.length === 0 && (
        <EmptyState
          title={activeTab === 'bookmarks' ? 'Your Watchlist is Empty' : 'No Watched Shows Recorded'}
          description={
            activeTab === 'bookmarks'
              ? 'Browse movies and series to save them to your personal bookmark list.'
              : 'Mark shows and movies as watched on detail pages to build your viewing history.'
          }
        />
      )}

      {!isLoading && activeItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {activeItems.map((item) => (
            <div key={item.id} className="relative group">
              <MovieCard content={item} />
              
              {/* Quick Remove Button Overlay */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (activeTab === 'bookmarks') {
                    removeBookmarkMutation.mutate(item.id);
                  } else {
                    removeWatchedMutation.mutate(item.id);
                  }
                }}
                title={`Remove from ${activeTab}`}
                className="absolute top-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-xl bg-black/80 text-slate-300 hover:text-rose-400 hover:bg-black border border-white/20 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}