import { Link } from 'react-router-dom';
import { Star, ExternalLink, Calendar, Film } from 'lucide-react';
import { motion } from 'framer-motion';
import RankBadge from './RankBadge';

export default function LeaderboardCard({ content, rank }) {
  const {
    id,
    title,
    release_date,
    poster_path,
    imdb_rating,
    genres = [],
    watch_providers
  } = content;

  const year = release_date ? new Date(release_date).getFullYear() : 'TBA';
  const directLink = watch_providers?.watch_link;
  const providersList = watch_providers?.providers || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group relative flex items-center justify-between gap-4 p-4 rounded-2xl bg-brand-card border border-brand-border hover:border-slate-700 transition-all shadow-card hover:bg-brand-cardHover"
    >
      {/* Left Section: Rank + Poster + Title Info */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Numerical Rank Badge */}
        <RankBadge rank={rank} />

        {/* Poster Thumbnail (Clickable Link) */}
        <Link
          to={`/content/${id}`}
          className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-accent"
        >
          {poster_path ? (
            <img
              src={poster_path}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-600">
              <Film className="h-5 w-5" />
            </div>
          )}
        </Link>

        {/* Title (Clickable Link), Year, and Genres */}
        <div className="min-w-0">
          <Link
            to={`/content/${id}`}
            className="block focus:outline-none"
          >
            <h3 className="text-sm md:text-base font-bold text-white hover:text-brand-accent transition-colors truncate">
              {title}
            </h3>
          </Link>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-brand-muted">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {year}
            </span>
            <span>&bull;</span>
            <div className="flex items-center gap-1">
              {genres.slice(0, 2).map((g) => (
                <span key={g.id} className="text-slate-400">
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Stream Providers + IMDb Rating */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Streaming Platform Badges */}
        {providersList.length > 0 && (
          <div className="hidden sm:flex items-center gap-1.5">
            {providersList.slice(0, 2).map((provider) => (
              <div
                key={provider.provider_id}
                title={`Available on ${provider.name}`}
                className="h-7 w-7 rounded-lg overflow-hidden border border-slate-700 bg-slate-800 p-0.5"
              >
                {provider.logo_path ? (
                  <img src={provider.logo_path} alt={provider.name} className="h-full w-full rounded object-cover" />
                ) : (
                  <span className="text-[9px] text-center block text-slate-300 font-bold">{provider.name.slice(0, 2)}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* IMDb Score Display */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-brand-gold font-bold text-sm">
          <Star className="h-4 w-4 fill-brand-gold" />
          <span>{imdb_rating ? imdb_rating.toFixed(1) : 'NR'}</span>
        </div>

        {/* Direct Platform Redirect Link */}
        {directLink ? (
          <a
            href={directLink}
            target="_blank"
            rel="noopener noreferrer"
            title="Watch on platform"
            className="flex items-center justify-center h-8 w-8 rounded-lg bg-brand-accent/20 hover:bg-brand-accent text-brand-accent hover:text-white transition-colors border border-brand-accent/30"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          <div className="h-8 w-8" />
        )}
      </div>
    </motion.div>
  );
}