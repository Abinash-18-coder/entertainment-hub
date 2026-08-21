import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      <span className="px-4 py-2 text-xs font-mono text-brand-muted bg-brand-dark rounded-xl border border-brand-border">
        Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}