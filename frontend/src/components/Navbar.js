import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `rounded-pill px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-coral-100 text-coral-800' : 'text-ink-700 hover:bg-white/75'}`;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/40 bg-white/65 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6 lg:px-8">
        <Link to="/" className="font-heading text-xl font-extrabold tracking-tight text-ink-900 md:text-2xl">
          RunBuddy
        </Link>

        {user ? (
          <div className="flex flex-wrap items-center justify-end gap-2 md:gap-3">
            <NavLink to="/home" className={navLinkClass}>Home</NavLink>
            <NavLink to="/create-request" className={navLinkClass}>New Run</NavLink>
            <NavLink to="/history" className={navLinkClass}>History</NavLink>
            <NavLink to="/notifications" className={navLinkClass}>Alerts</NavLink>
            <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50"
              onClick={() => {
                if (window.confirm('Log out from this session?')) {
                  logout();
                  navigate('/');
                }
              }}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-pill border border-coral-300 bg-white/80 px-4 py-2 text-sm font-semibold text-coral-700 transition hover:bg-white">
              Login
            </Link>
            <Link to="/signup" className="rounded-pill bg-coral-600 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-coral-700">
              Join Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;