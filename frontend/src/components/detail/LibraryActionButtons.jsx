import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { fetchLibraryStatus, toggleBookmark, toggleWatched } from '../../api/library';
import { Bookmark, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LibraryActionButtons({ contentId }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch bookmark & watched status for this content item
  const { data: status, isLoading } = useQuery({
    queryKey: ['library', 'status', contentId],
    queryFn: () => fetchLibraryStatus(contentId),
    enabled: isAuthenticated, // Only fetch if user is logged in
    staleTime: 1000 * 60 * 5,
  });

  // Bookmark Mutation with Optimistic UI & Rollback
  const bookmarkMutation = useMutation({
    mutationFn: () => toggleBookmark(contentId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['library', 'status', contentId] });
      const previousStatus = queryClient.getQueryData(['library', 'status', contentId]);

      // Optimistically flip the bookmark state
      if (previousStatus) {
        queryClient.setQueryData(['library', 'status', contentId], {
          ...previousStatus,
          is_bookmarked: !previousStatus.is_bookmarked,
        });
      }
      return { previousStatus };
    },
    onError: (err, variables, context) => {
      // Rollback to previous state on server error
      if (context?.previousStatus) {
        queryClient.setQueryData(['library', 'status', contentId], context.previousStatus);
      }
    },
    onSettled: () => {
      // Invalidate queries so lists update immediately
      queryClient.invalidateQueries({ queryKey: ['library', 'status', contentId] });
      queryClient.invalidateQueries({ queryKey: ['library', 'bookmarks'] });
    },
  });

  // Watched Mutation with Optimistic UI & Rollback
  const watchedMutation = useMutation({
    mutationFn: () => toggleWatched(contentId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['library', 'status', contentId] });
      const previousStatus = queryClient.getQueryData(['library', 'status', contentId]);

      if (previousStatus) {
        queryClient.setQueryData(['library', 'status', contentId], {
          ...previousStatus,
          is_watched: !previousStatus.is_watched,
        });
      }
      return { previousStatus };
    },
    onError: (err, variables, context) => {
      if (context?.previousStatus) {
        queryClient.setQueryData(['library', 'status', contentId], context.previousStatus);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['library', 'status', contentId] });
      queryClient.invalidateQueries({ queryKey: ['library', 'watched'] });
    },
  });

  const handleBookmarkClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    bookmarkMutation.mutate();
  };

  const handleWatchedClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    watchedMutation.mutate();
  };

  const isBookmarked = status?.is_bookmarked || false;
  const isWatched = status?.is_watched || false;

  return (
    <div className="flex items-center gap-3 pt-2">
      {/* Bookmark Action Button */}
      <button
        onClick={handleBookmarkClick}
        disabled={isLoading || bookmarkMutation.isPending}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
          isBookmarked
            ? 'bg-brand-accent text-white border-brand-accent shadow-glow'
            : 'bg-brand-card text-slate-200 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
        }`}
      >
        {bookmarkMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-white' : ''}`} />
        )}
        <span>{isBookmarked ? 'Bookmarked' : 'Add to Watchlist'}</span>
      </button>

      {/* Watched Action Button */}
      <button
        onClick={handleWatchedClick}
        disabled={isLoading || watchedMutation.isPending}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
          isWatched
            ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
            : 'bg-brand-card text-slate-200 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
        }`}
      >
        {watchedMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className={`h-4 w-4 ${isWatched ? 'fill-white text-emerald-600' : ''}`} />
        )}
        <span>{isWatched ? 'Watched' : 'Mark as Watched'}</span>
      </button>
    </div>
  );
}