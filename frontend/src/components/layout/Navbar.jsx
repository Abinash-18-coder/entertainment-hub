import { NavLink, Link } from 'react-router-dom';
import { Film, Calendar, Flame, Layers, Bookmark, Clapperboard } from 'lucide-react';

export default function Navbar() {
  const navLinks = [
    { name: 'Featured', path: '/', icon: Flame },
    { name: 'Upcoming', path: '/upcoming', icon: Calendar },
    { name: 'Genres', path: '/genres', icon: Layers },
    { name: 'Top IMDb', path: '/leaderboards', icon: Film },
    { name: 'My Library', path: '/library', icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-border/60 bg-brand-dark/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-accent shadow-glow transition-transform group-hover:scale-105">
            <Clapperboard className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-wider text-white">
            CINE<span className="text-brand-accent">VERSE</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-card text-white border border-brand-border shadow-sm'
                      : 'text-brand-muted hover:text-white hover:bg-slate-800/40'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Right CTA / User Status */}
        <div className="flex items-center gap-3">
          <Link
            to="/library"
            className="rounded-lg bg-brand-accent px-4 py-2 text-xs font-semibold text-white hover:bg-brand-accentHover shadow-glow transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}