import { CalendarX, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmptyState({ 
  title = "No Releases Scheduled", 
  description = "No upcoming titles match your current filter criteria.",
  onReset 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center bg-brand-card/40 border border-brand-border rounded-3xl max-w-lg mx-auto my-12 backdrop-blur-sm"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 border border-slate-700 text-brand-muted mb-4 shadow-inner">
        <CalendarX className="h-8 w-8 text-slate-400" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-brand-muted mb-6 max-w-xs leading-relaxed">
        {description}
      </p>

      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-xl bg-brand-accent px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-accentHover shadow-glow transition-all"
        >
          <RotateCcw className="h-4 w-4" />
          Reset All Filters
        </button>
      )}
    </motion.div>
  );
}