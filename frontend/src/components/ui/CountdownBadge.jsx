import { Clock } from 'lucide-react';
import { getCountdownLabel } from '../../utils/dateUtils';

export default function CountdownBadge({ releaseDate }) {
  const countdown = getCountdownLabel(releaseDate);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border backdrop-blur-md transition-all shadow-sm ${countdown.highlight}`}
    >
      <Clock className="h-3 w-3" />
      {countdown.text}
    </span>
  );
}