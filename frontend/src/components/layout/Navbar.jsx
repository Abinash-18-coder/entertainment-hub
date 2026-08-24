import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Film, Calendar, Flame, Layers, Bookmark, Clapperboard, LogOut, User as UserIcon, Search } from 'lucide-react';

export default function Navbar({ onOpenSearch }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Featured', path: '/', icon: Flame },
    { name: 'Upcoming', path: '/upcoming', icon: Calendar },
    { name: 'Genres', path: '/genres', icon: Layers },
    { name: 'Top IMDb', path: '/leaderboards', icon: Film },
    { name: 'My Library', path: '/library', icon: Bookmark },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-border/60 bg-brand-dark/80 backdrop-blur-xl">
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
        <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
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
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Spotlight Search Trigger Button */}
          <button
            onClick={onOpenSearch}
            aria-label="Open search dialog"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-card hover:bg-slate-800 border border-brand-border text-xs text-slate-300 transition-all"
          >
            <Search className="h-3.5 w-3.5 text-brand-muted" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-brand-subtle bg-slate-900 border border-slate-700 rounded">
              ⌘K
            </kbd>
          </button>

          {/* User Status / Login */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-card border border-brand-border text-xs font-semibold text-slate-200">
                <UserIcon className="h-3.5 w-3.5 text-brand-accent" />
                <span className="max-w-32.5 truncate">{user?.email}</span>
              </div>

              <button
                onClick={handleLogout}
                title="Log out"
                aria-label="Log out"
                className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-rose-300 border border-slate-700 hover:border-red-500/30 px-3 py-2 text-xs font-semibold text-slate-300 transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-brand-accent px-4 py-2 text-xs font-bold text-white hover:bg-brand-accentHover shadow-glow transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}