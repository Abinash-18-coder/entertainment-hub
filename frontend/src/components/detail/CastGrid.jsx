import { Users } from 'lucide-react';
import ImageWithFallback from '../ui/ImageWithFallback';

export default function CastGrid({ castCredits = [] }) {
  if (castCredits.length === 0) {
    return (
      <div className="text-xs text-brand-muted py-4">
        No cast information registered for this title.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
        <Users className="h-5 w-5 text-brand-accent" />
        <h3 className="text-lg font-bold text-white tracking-wide">
          Top Billed Cast
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {castCredits.map((credit) => {
          const person = credit.person || {};
          return (
            <div
              key={credit.id || person.id}
              className="flex flex-col rounded-xl bg-brand-card border border-brand-border overflow-hidden hover:border-slate-700 transition-colors shadow-sm"
            >
              {/* Actor Headshot */}
              <ImageWithFallback
                src={person.profile_path}
                alt={person.name}
                type="person"
                aspectRatio="aspect-[3/4]"
                className="w-full"
              />

              {/* Actor & Character Names */}
              <div className="p-3">
                <h4 className="text-xs md:text-sm font-bold text-slate-100 truncate" title={person.name}>
                  {person.name}
                </h4>
                <p className="text-[11px] text-brand-muted truncate mt-0.5" title={credit.character_name}>
                  {credit.character_name ? `as ${credit.character_name}` : 'Self'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}