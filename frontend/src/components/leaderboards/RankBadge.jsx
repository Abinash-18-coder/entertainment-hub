import { Trophy, Medal, Award } from 'lucide-react';

export default function RankBadge({ rank }) {
  if (rank === 1) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400 font-black shadow-glow">
        <Trophy className="h-5 w-5" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-300/20 border border-slate-300/50 text-slate-200 font-black">
        <Medal className="h-5 w-5" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-700/20 border border-amber-700/50 text-amber-600 font-black">
        <Award className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700 text-brand-muted text-xs font-bold font-mono">
      #{rank}
    </div>
  );
}