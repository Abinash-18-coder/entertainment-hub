import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchContentDetail } from '../api/contents';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import WatchProviders from '../components/detail/WatchProviders';
import CastGrid from '../components/detail/CastGrid';
import LibraryActionButtons from '../components/detail/LibraryActionButtons';
import DetailSkeleton from '../components/detail/DetailSkeleton';
import ErrorState from '../components/ui/ErrorState';
import { Star, Calendar, Film, Tv, ArrowLeft, Share2 } from 'lucide-react';
import { formatDisplayDate } from '../utils/dateUtils';

export default function DetailPage() {
  const { id } = useParams();

  // Fetch title details by ID
  const { data: content, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['content', id],
    queryFn: () => fetchContentDetail(id),
    staleTime: 1000 * 60 * 10, // 10-minute cache
  });

  if (isLoading) return <DetailSkeleton />;

  if (isError || !content) {
    return (
      <ErrorState
        message={error?.response?.data?.detail || "Could not find the requested title."}
        onRetry={() => refetch()}
      />
    );
  }

  const {
    title,
    content_type,
    overview,
    release_date,
    poster_path,
    backdrop_path,
    imdb_rating,
    genres = [],
    cast_credits = [],
    watch_providers
  } = content;

  return (
    <div className="space-y-10 pb-16">
      {/* Navigation Back Button */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </Link>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title, url: window.location.href });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-card border border-brand-border text-xs font-medium text-slate-300 hover:text-white transition-all"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </button>
      </div>

      {/* Hero Section with Backdrop */}
      <section className="relative overflow-hidden rounded-3xl bg-brand-card border border-brand-border shadow-2xl">
        {/* Full-bleed Backdrop Image with Gradient Overlay */}
        {backdrop_path && (
          <div className="absolute inset-0 z-0">
            <img
              src={backdrop_path}
              alt={title}
              className="h-full w-full object-cover opacity-20 filter blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-brand-card via-brand-card/80 to-transparent" />
          </div>
        )}

        {/* Hero Content Grid */}
        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Main Poster */}
          <div className="w-48 sm:w-56 shrink-0 shadow-2xl rounded-2xl overflow-hidden border border-slate-700/60">
            <ImageWithFallback
              src={poster_path}
              alt={title}
              type="poster"
              aspectRatio="aspect-[2/3]"
            />
          </div>

          {/* Metadata Column */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            {/* Type & Release Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-dark/90 text-[11px] font-bold uppercase tracking-wider text-slate-200 border border-white/10">
                {content_type === 'movie' ? <Film className="h-3 w-3 text-brand-accent" /> : <Tv className="h-3 w-3 text-blue-400" />}
                {content_type}
              </span>

              <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-subtle">
                <Calendar className="h-3.5 w-3.5 text-brand-muted" />
                {formatDisplayDate(release_date, 'MMMM d, yyyy')}
              </span>

              {imdb_rating && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-brand-gold">
                  <Star className="h-3.5 w-3.5 fill-brand-gold" />
                  {imdb_rating.toFixed(1)} IMDb
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {title}
            </h1>

            {/* Genre Tags */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              {genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <div className="space-y-1.5 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-subtle">
                Overview
              </h3>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl">
                {overview || 'No synopsis description provided for this title.'}
              </p>
            </div>

            {/* Interactive User Library Action Buttons */}
            <div className="pt-2">
              <LibraryActionButtons contentId={id} />
            </div>
          </div>
        </div>
      </section>

      {/* Streaming Platform Availability */}
      <section>
        <WatchProviders watchProviders={watch_providers} />
      </section>

      {/* Cast & Crew Grid */}
      <section>
        <CastGrid castCredits={cast_credits} />
      </section>
    </div>
  );
}