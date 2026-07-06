import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, HardHat, LogOut, Menu, Settings, User, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import Avatar from '../ui/Avatar.jsx';
import NotificationBell from './NotificationBell.jsx';

function getDashboardPath(role) {
  if (role === 'employer') return '/employer';
  if (role === 'worker') return '/worker';
  if (role === 'admin') return '/admin';
  return '/';
}

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { ROLES } = useData();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/jobs', label: 'Browse Jobs' },
    { to: '/companies', label: 'Companies' },
    { to: '/about', label: 'How it works' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-ink-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
              <HardHat size={18} />
            </span>
            <div className="leading-tight">
              <p className="text-base font-bold text-ink-900">Jobnet</p>
              <p className="-mt-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-500">
                Canada
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-brand-700' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <NotificationBell />
              <Link
                to={getDashboardPath(currentUser.role)}
                className="hidden text-sm font-medium text-ink-700 hover:text-ink-900 md:inline-flex"
              >
                Dashboard
              </Link>
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-ink-100"
                >
                  <Avatar initials={currentUser.avatar} seed={currentUser.id} size="sm" />
                  <ChevronDown size={14} className="text-ink-400" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 animate-slide-up overflow-hidden rounded-xl border border-ink-200 bg-white shadow-cardHover">
                    <div className="border-b border-ink-100 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-ink-900">
                        {currentUser.firstName} {currentUser.lastName}
                      </p>
                      <p className="truncate text-xs text-ink-500">{currentUser.email}</p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-brand-700">
                        {currentUser.role}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        to={getDashboardPath(currentUser.role)}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50"
                      >
                        <User size={14} /> Dashboard
                      </Link>
                      <Link
                        to={
                          currentUser.role === ROLES.EMPLOYER
                            ? '/employer/company'
                            : currentUser.role === ROLES.WORKER
                            ? '/worker/profile'
                            : '/admin'
                        }
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50"
                      >
                        <Settings size={14} /> Profile settings
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 border-t border-ink-100 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={14} /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost hidden sm:inline-flex">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary">
                Get started
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-md p-2 text-ink-600 hover:bg-ink-100 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-ink-100 bg-white md:hidden">
          <nav className="flex flex-col px-4 py-3">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-100'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {!currentUser && (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
