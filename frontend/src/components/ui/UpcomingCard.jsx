import { Link } from 'react-router-dom';
import { Calendar, Film, Tv, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDisplayDate } from '../../utils/dateUtils';
import CountdownBadge from './CountdownBadge';
import ImageWithFallback from './ImageWithFallback';

export default function UpcomingCard({ content }) {
  const {
    id,
    title,
    content_type,
    release_date,
    poster_path,
    overview,
    imdb_rating,
    genres = []
  } = content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
    >
      <Link
        to={`/content/${id}`}
        className="group relative flex flex-col md:flex-row overflow-hidden rounded-2xl bg-brand-card border border-brand-border hover:border-slate-700 shadow-card transition-all duration-300 "
      >
        {/* Poster Thumbnail */}
        <div className="relative w-full md:w-48 aspect-2/3 md:aspect-auto shrink-0 overflow-hidden bg-slate-900">
          <ImageWithFallback
            src={poster_path}
            alt={title}
            type="poster"
            aspectRatio="h-full w-full"
            className="group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute top-3 left-3 pointer-events-none z-10">
            <span className="flex items-center gap-1 rounded-md bg-brand-dark/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-200 backdrop-blur-md border border-white/10">
              {content_type === 'movie' ? <Film className="h-3 w-3 text-brand-accent" /> : <Tv className="h-3 w-3 text-blue-400" />}
              {content_type}
            </span>
          </div>
        </div>

        {/* Details Column */}
        <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-accent">
                <Calendar className="h-4 w-4" />
                <span>{formatDisplayDate(release_date, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <CountdownBadge releaseDate={release_date} />
            </div>

            <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-brand-accent transition-colors line-clamp-1">
              {title}
            </h3>

            <p className="mt-2 text-xs md:text-sm text-brand-muted line-clamp-2 leading-relaxed">
              {overview || 'No synopsis available yet for this upcoming title.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-brand-border/60">
            <div className="flex flex-wrap gap-1.5">
              {genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-md bg-slate-800/90 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-700/60"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {imdb_rating ? (
              <div className="flex items-center gap-1 text-xs font-bold text-brand-gold bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                <Star className="h-3.5 w-3.5 fill-brand-gold" />
                <span>{imdb_rating.toFixed(1)}</span>
              </div>
            ) : (
              <span className="text-[11px] font-medium text-brand-subtle">Rating TBA</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}