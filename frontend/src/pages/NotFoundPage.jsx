import { Link } from 'react-router-dom';
import { Clapperboard, Home, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md space-y-6"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-accent/20 border border-brand-accent/40 text-brand-accent shadow-glow">
          <Clapperboard className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-brand-accent">
            Error 404
          </span>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Scene Not Found
          </h1>
          <p className="text-sm text-brand-muted leading-relaxed">
            The reel you are looking for has been cut or moved to another theater.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-accent text-white text-xs font-bold hover:bg-brand-accentHover shadow-glow transition-all"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            to="/genres"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-slate-200 text-xs font-bold hover:bg-slate-800 transition-all"
          >
            <Compass className="h-4 w-4" />
            Browse Genres
          </Link>
        </div>
      </motion.div>
    </div>
  );
}