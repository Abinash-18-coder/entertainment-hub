import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message = "Failed to load titles", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-brand-card/50 border border-red-500/20 rounded-2xl max-w-lg mx-auto my-8">
      <AlertCircle className="h-12 w-12 text-brand-accent mb-4" />
      <h3 className="text-lg font-bold text-white mb-2">Something Went Wrong</h3>
      <p className="text-sm text-brand-muted mb-6 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 rounded-lg bg-brand-card border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
}