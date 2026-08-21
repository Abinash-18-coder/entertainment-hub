import { Sparkles } from 'lucide-react';

export default function GenrePills({ genres = [], selectedGenreId, onSelectGenre }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {/* "All Genres" Default Button */}
      <button
        onClick={() => onSelectGenre(null)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
          selectedGenreId === null
            ? 'bg-brand-accent text-white shadow-glow'
            : 'bg-brand-card text-brand-muted hover:text-white hover:bg-slate-800 border border-brand-border'
        }`}
      >
        <Sparkles className="h-3.5 w-3.5" />
        All Genres
      </button>

      {/* Dynamic Genres from Backend */}
      {genres.map((genre) => {
        const isSelected = selectedGenreId === genre.id;
        return (
          <button
            key={genre.id}
            onClick={() => onSelectGenre(genre.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-brand-accent text-white shadow-glow'
                : 'bg-brand-card text-brand-muted hover:text-white hover:bg-slate-800 border border-brand-border'
            }`}
          >
            {genre.name}
          </button>
        );
      })}
    </div>
  );
}