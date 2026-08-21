import { Link } from 'react-router-dom';
import { Star, Film, Tv, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageWithFallback from './ImageWithFallback';

export default function MovieCard({ content }) {
  const {
    id,
    title,
    content_type,
    release_date,
    poster_path,
    imdb_rating,
    genres = []
  } = content;

  const releaseYear = release_date ? new Date(release_date).getFullYear() : 'TBA';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
    >
      <Link
        to={`/content/${id}`}
        className="group relative block flex-col overflow-hidden rounded-xl bg-brand-card border border-brand-border hover:border-slate-700 shadow-card transition-all duration-300 h-full"
      >
        {/* Poster Image */}
        <div className="relative aspect-2/3 w-full overflow-hidden bg-slate-900">
          <ImageWithFallback
            src={poster_path}
            alt={title}
            type="poster"
            aspectRatio="aspect-[2/3]"
            className="transition-transform duration-500 group-hover:scale-105"
          />

          {/* Top Floating Badges */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
            <span className="flex items-center gap-1 rounded-md bg-brand-dark/80 px-2 py-1 text-[11px] font-semibold tracking-wide uppercase backdrop-blur-md border border-white/10 text-slate-200">
              {content_type === 'movie' ? <Film className="h-3 w-3 text-brand-accent" /> : <Tv className="h-3 w-3 text-blue-400" />}
              {content_type}
            </span>

            {imdb_rating ? (
              <span className="flex items-center gap-1 rounded-md bg-black/80 px-2 py-1 text-xs font-bold text-brand-gold backdrop-blur-md border border-amber-500/20">
                <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
                {imdb_rating.toFixed(1)}
              </span>
            ) : (
              <span className="rounded-md bg-black/80 px-2 py-1 text-[11px] font-medium text-brand-muted backdrop-blur-md border border-white/10">
                NR
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-brand-subtle mb-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{releaseYear}</span>
          </div>

          <h3 className="font-semibold text-slate-100 text-sm md:text-base line-clamp-1 group-hover:text-brand-accent transition-colors" title={title}>
            {title}
          </h3>

          <div className="mt-2.5 flex flex-wrap gap-1">
            {genres.slice(0, 2).map((genre) => (
              <span
                key={genre.id}
                className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700/50"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}