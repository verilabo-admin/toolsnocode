import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Zap, Heart, User, LogOut, Plus, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navLinks = [
  { label: 'Tools', href: '/tools' },
  { label: 'Experts', href: '/experts' },
  { label: 'Tutorials', href: '/tutorials' },
  { label: 'Projects', href: '/projects' },
  { label: 'News', href: '/news' },
];

const createLinks = [
  { label: 'Tool', href: '/tools/new' },
  { label: 'Expert', href: '/experts/new' },
  { label: 'Tutorial', href: '/tutorials/new' },
  { label: 'Project', href: '/projects/new' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const createMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (createMenuRef.current && !createMenuRef.current.contains(e.target as Node)) {
        setCreateMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setCreateMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center group-hover:bg-brand-400 transition-colors">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Tools<span className="text-brand-400">NoCode</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-brand-400 bg-brand-500/10'
                      : 'text-surface-400 hover:text-surface-100 hover:bg-surface-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/tools" className="p-2 text-surface-400 hover:text-surface-100 transition-colors">
              <Search className="w-5 h-5" />
            </Link>

            {user ? (
              <>
                <Link
                  to="/favorites"
                  className={`p-2 rounded-lg transition-colors ${
                    location.pathname === '/favorites'
                      ? 'text-rose-400 bg-rose-500/10'
                      : 'text-surface-400 hover:text-rose-400'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </Link>

                <div className="relative" ref={createMenuRef}>
                  <button
                    onClick={() => setCreateMenuOpen(!createMenuOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Create
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${createMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {createMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface-900 border border-surface-700/50 rounded-xl shadow-xl shadow-black/30 py-1.5 animate-fade-in">
                      {createLinks.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          className="block px-4 py-2.5 text-sm text-surface-300 hover:text-white hover:bg-surface-800/80 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-9 h-9 rounded-xl bg-surface-800 border border-surface-700 flex items-center justify-center text-surface-400 hover:text-surface-200 hover:border-surface-600 transition-all"
                  >
                    <User className="w-4 h-4" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-surface-900 border border-surface-700/50 rounded-xl shadow-xl shadow-black/30 py-1.5 animate-fade-in">
                      <div className="px-4 py-2.5 border-b border-surface-800">
                        <p className="text-xs text-surface-500">Signed in as</p>
                        <p className="text-sm text-surface-200 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/account"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-surface-300 hover:text-white hover:bg-surface-800/80 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Account
                      </Link>
                      <Link
                        to="/favorites"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-surface-300 hover:text-white hover:bg-surface-800/80 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        My Favorites
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/auth" className="btn-primary text-sm">
                Sign In
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-surface-400 hover:text-surface-100"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-surface-950/95 backdrop-blur-xl border-b border-surface-800/50 animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-brand-400 bg-brand-500/10'
                      : 'text-surface-400 hover:text-surface-100 hover:bg-surface-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {user && (
              <>
                <div className="border-t border-surface-800/50 pt-2 mt-2">
                  <Link
                    to="/account"
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium text-surface-400 hover:text-surface-100 hover:bg-surface-800/50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Account
                  </Link>
                  <Link
                    to="/favorites"
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium text-surface-400 hover:text-surface-100 hover:bg-surface-800/50 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    My Favorites
                  </Link>
                </div>
                <div className="border-t border-surface-800/50 pt-2 mt-2">
                  <p className="px-4 py-1.5 text-xs text-surface-500 font-medium uppercase tracking-wider">Create New</p>
                  {createLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="block px-4 py-2.5 rounded-lg text-sm text-surface-400 hover:text-surface-100 hover:bg-surface-800/50 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </>
            )}

            <div className="pt-3">
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-surface-800 text-rose-400 text-sm font-medium hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              ) : (
                <Link to="/auth" className="btn-primary text-sm w-full">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
