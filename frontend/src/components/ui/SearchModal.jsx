import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchContents } from '../../api/contents';
import { Search, Film, Tv, Star, X, Loader2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchContents(query.trim(), 1);
        setResults(data.items || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelectItem = (id) => {
    onClose();
    navigate(`/content/${id}`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Search Dialog Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          role="dialog"
          aria-modal="true"
          aria-label="Search titles"
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-brand-card border border-brand-border shadow-2xl"
        >
          {/* Top Search Input Bar */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-brand-border">
            <Search className="h-5 w-5 text-brand-muted shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, TV series, sitcoms..."
              className="w-full bg-transparent text-sm md:text-base text-white placeholder-slate-500 focus:outline-none"
            />
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-brand-accent" />}
            {query && !isLoading && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-lg text-brand-subtle hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold text-brand-subtle bg-slate-900 border border-slate-700 rounded-md">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/40">
            {results.length > 0 ? (
              results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  className="w-full flex items-center justify-between gap-4 p-3 rounded-2xl hover:bg-slate-800/60 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-900 border border-slate-800">
                      {item.poster_path ? (
                        <img src={item.poster_path} alt={item.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-600">
                          <Film className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white group-hover:text-brand-accent transition-colors truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-brand-muted mt-0.5">
                        <span className="flex items-center gap-1 uppercase text-[10px] font-semibold">
                          {item.content_type === 'movie' ? (
                            <Film className="h-3 w-3 text-brand-accent" />
                          ) : (
                            <Tv className="h-3 w-3 text-blue-400" />
                          )}
                          {item.content_type}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {item.release_date ? new Date(item.release_date).getFullYear() : 'TBA'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {item.imdb_rating && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-brand-gold text-xs font-bold">
                      <Star className="h-3.5 w-3.5 fill-brand-gold" />
                      {item.imdb_rating.toFixed(1)}
                    </div>
                  )}
                </button>
              ))
            ) : query.trim() && !isLoading ? (
              <div className="py-12 text-center text-xs text-brand-muted">
                No titles found matching "{query}"
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-brand-subtle">
                Type a title name to search across the entire catalog
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}