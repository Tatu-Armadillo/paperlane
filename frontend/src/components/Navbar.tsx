import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BookOpenText, Moon, Sun, PenLine, LayoutList } from 'lucide-react';
import { useTheme } from '../hooks/useTheme.tsx';
import { classNames } from '../utils/format.js';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const links = [
    { to: '/home', label: 'Library' },
    { to: '/publish', label: 'Publish', isAuthenticated: true },
    { to: '/categories', label: 'Categories', isAuthenticated: true },
    { to: '/login', label: 'Login', guestOnly: true },
  ];

  return (
    <header
      data-testid="site-navbar"
      className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md"
    >
      <div className="paper-container flex h-16 items-center justify-between">
        <Link
          to="/"
          data-testid="brand-link"
          className="flex items-center gap-2.5 group"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <BookOpenText className="h-4.5 w-4.5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Paperlane
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-1 rounded-full border border-border bg-card/60 p-1"
        >
          {links
            .filter((link) => {
              if (link.isAuthenticated) return isAuthenticated;
              if (link.guestOnly) return !isAuthenticated;
              return true;
            })
            .map((l) => {
              const active =
                location.pathname === l.to ||
                (l.to !== '/' && location.pathname.startsWith(l.to));

              return (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={classNames(
                    'px-4 py-1.5 text-sm rounded-full transition-colors',
                    active
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {l.label}
                </NavLink>
              );
            })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            data-testid="theme-toggle"
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card/60 text-muted-foreground transition hover:text-foreground"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          {isAuthenticated && (
            <Link
              to="/publish"
              className="paper-btn-ghost hidden sm:inline-flex"
            >
              <PenLine className="h-3.5 w-3.5" />
              Publish
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to="/categories"
              className="paper-btn-ghost md:hidden"
            >
              <LayoutList className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;