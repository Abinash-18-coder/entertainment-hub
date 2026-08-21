import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchContents, fetchGenres } from '../api/contents';
import GenrePills from '../components/genres/GenrePills';
import MovieCard from '../components/ui/MovieCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { Layers, Film, Tv, Sparkles } from 'lucide-react';

export default function GenresPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedGenreId, setSelectedGenreId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Fetch official genres list
  const { data: genres = [], isLoading: isLoadingGenres } = useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenres,
    staleTime: 1000 * 60 * 30, // 30-minute cache
  });

  // 2. Fetch filtered content based on chosen type and genre
  const {
    data: contentData,
    isLoading: isLoadingContents,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['contents', 'genre-browse', selectedType, selectedGenreId, currentPage],
    queryFn: () => fetchContents({
      contentType: selectedType === 'all' ? null : selectedType,
      genreId: selectedGenreId,
      sortBy: 'rating',
      page: currentPage,
      pageSize: 20
    }),
    staleTime: 1000 * 60 * 5,
  });

  // Reset pagination to page 1 whenever filters change
  const handleTypeChange = (type) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenreId(genreId);
    setCurrentPage(1);
  };

  const activeGenreName = genres.find((g) => g.id === selectedGenreId)?.name || 'All Categories';

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-brand-card to-slate-950 p-8 md:p-12 border border-brand-border shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-accent/10 border border-brand-accent/30 px-3.5 py-1 text-xs font-bold text-brand-accent">
            <Layers className="h-3.5 w-3.5" />
            Genre Catalog & Categorization
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Explore by Genre
          </h1>
          <p className="text-sm md:text-base text-brand-muted">
            Filter high-rated movies, series, and sitcoms across Action, Sci-Fi, Comedy, Drama, and 15+ more genres.
          </p>
        </div>
      </section>

      {/* Filter Toolbar: Content Type + Search Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Content Type Filter */}
        <div className="flex items-center bg-brand-card p-1 rounded-2xl border border-brand-border w-fit">
          {[
            { id: 'all', label: 'All Media', icon: Sparkles },
            { id: 'movie', label: 'Movies Only', icon: Film },
            { id: 'series', label: 'TV Shows Only', icon: Tv },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = selectedType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTypeChange(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-brand-accent text-white shadow-glow'
                    : 'text-brand-muted hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Selected Label & Total Matches */}
        <div className="text-xs font-medium text-brand-muted">
          Showing: <span className="text-white font-bold">{activeGenreName}</span> &bull; {contentData?.total_count || 0} Results
        </div>
      </div>

      {/* Horizontal Genre Pills Ribbon */}
      <GenrePills
        genres={genres}
        selectedGenreId={selectedGenreId}
        onSelectGenre={handleGenreChange}
      />

      {/* Main Content Area */}
      {isLoadingContents && <LoadingSkeleton count={10} />}

      {isError && (
        <ErrorState
          message={error?.response?.data?.detail || 'Failed to load genre contents.'}
          onRetry={() => refetch()}
        />
      )}

      {!isLoadingContents && !isError && contentData?.items?.length === 0 && (
        <EmptyState
          title="No Titles Found"
          description={`No titles in our database match the category "${activeGenreName}".`}
          onReset={() => {
            setSelectedGenreId(null);
            setSelectedType('all');
            setCurrentPage(1);
          }}
        />
      )}

      {!isLoadingContents && !isError && contentData?.items?.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {contentData.items.map((item) => (
              <MovieCard key={item.id} content={item} />
            ))}
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={contentData.page}
            totalPages={contentData.total_pages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
          />
        </>
      )}
    </div>
  );
}