import { ExternalLink, Tv } from 'lucide-react';

export default function WatchProviders({ watchProviders }) {
  const directLink = watchProviders?.watch_link;
  const providers = watchProviders?.providers || [];

  if (!directLink && providers.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-brand-card/60 border border-brand-border flex items-center gap-3 text-sm text-brand-muted">
        <Tv className="h-5 w-5 text-slate-500" />
        <span>Currently not available on major digital subscription streaming platforms.</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-5 rounded-2xl bg-brand-card/90 border border-brand-border shadow-card backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
          Where to Stream
        </h3>
        <span className="text-[11px] text-brand-subtle font-mono">
          Verified Providers
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {/* Provider Logos */}
        <div className="flex flex-wrap items-center gap-2.5">
          {providers.length > 0 ? (
            providers.map((provider) => (
              <div
                key={provider.provider_id || provider.name}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800"
                title={provider.name}
              >
                {provider.logo_path ? (
                  <img
                    src={provider.logo_path}
                    alt={provider.name}
                    className="h-6 w-6 rounded-md object-cover"
                  />
                ) : (
                  <Tv className="h-4 w-4 text-brand-accent" />
                )}
                <span className="text-xs font-semibold text-slate-200">
                  {provider.name}
                </span>
              </div>
            ))
          ) : (
            <span className="text-xs text-brand-muted">Direct watch options available online</span>
          )}
        </div>

        {/* Action Button */}
        {directLink && (
          <a
            href={directLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white text-xs font-bold shadow-glow transition-all"
          >
            <span>Watch on Platform</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}