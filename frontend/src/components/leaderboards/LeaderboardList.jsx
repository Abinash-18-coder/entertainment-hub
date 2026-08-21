import LeaderboardCard from './LeaderboardCard';
import EmptyState from '../ui/EmptyState';

export default function LeaderboardList({ items = [], title, description }) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No Leaderboard Entries"
        description="No rated titles found for this category in the database."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Category Sub-header */}
      <div className="pb-2 border-b border-brand-border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <p className="text-xs text-brand-muted">{description}</p>
        </div>
        <span className="text-xs font-mono text-brand-subtle">
          Top {items.length} Entries
        </span>
      </div>

      {/* Ranked List Stack */}
      <div className="space-y-2.5">
        {items.map((item, index) => (
          <LeaderboardCard key={item.id} content={item} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}