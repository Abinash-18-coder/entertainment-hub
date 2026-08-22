import { useAuth } from '../context/AuthContext';
import { Bookmark, CheckCircle, Clock, Film, Sparkles, User } from 'lucide-react';

export default function LibraryPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 pb-16">
      {/* Header Profile Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-brand-card to-slate-950 p-8 md:p-12 border border-brand-border shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-accent shadow-glow text-white font-black text-2xl">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 mb-1">
                <CheckCircle className="h-3 w-3" />
                Authenticated Session
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                {user?.email}
              </h1>
              <p className="text-xs text-brand-muted mt-0.5">
                Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '2026'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="block text-xs text-brand-subtle">User ID</span>
              <span className="text-xs font-mono font-bold text-white">#{user?.id}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Library Navigation Tabs */}
      <div className="flex flex-wrap items-center bg-brand-card p-1.5 rounded-2xl border border-brand-border w-fit gap-1">
        {[
          { id: 'bookmarks', label: 'My Bookmarks', icon: Bookmark, count: 0 },
          { id: 'watched', label: 'Already Watched', icon: CheckCircle, count: 0 },
          { id: 'reminders', label: 'Release Reminders', icon: Clock, count: 0 },
        ].map((tab, idx) => {
          const Icon = tab.icon;
          const active = idx === 0;
          return (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                active
                  ? 'bg-brand-accent text-white shadow-glow'
                  : 'text-brand-muted hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${active ? 'bg-black/30' : 'bg-slate-800'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Placeholder for Week 11 User Content Relations */}
      <div className="p-12 text-center bg-brand-card/40 border border-brand-border rounded-3xl max-w-xl mx-auto space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-brand-accent mx-auto">
          <Sparkles className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-white">Your Personal Watchlist is Ready</h3>
        <p className="text-xs md:text-sm text-brand-muted leading-relaxed max-w-md mx-auto">
          In Week 11, we will implement the Many-to-Many Bookmark & Watched tracking engine so you can save titles directly from card pages!
        </p>
      </div>
    </div>
  );
}