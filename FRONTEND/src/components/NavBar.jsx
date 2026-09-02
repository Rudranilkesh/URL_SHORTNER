import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slice/authSlice.js';
import { logoutUser } from '../api/user.api.js';

export default function NavBar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [failedAvatar, setFailedAvatar] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore API failure and clear client state
    } finally {
      dispatch(logout());
      setIsOpen(false);
      navigate({ to: '/' });
    }
  };

  const getInitial = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="flex items-center justify-between border-b border-white/15 pb-6">
      {/* Left side: Brand logo & Navigation Links */}
      <div className="flex items-center gap-8">
        <Link
          to="/home"
          className="text-xl font-bold tracking-[-0.06em] text-white hover:opacity-90 transition-opacity select-none cursor-pointer outline-none"
          aria-label="RYL URL shortener home"
        >
          RYL<span className="text-nyc-yellow">.</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-4 select-none">
          <Link
            to="/home"
            className="text-sm font-medium text-white/70 hover:text-white transition-colors [&.active]:text-nyc-yellow [&.active]:font-semibold select-none cursor-pointer outline-none"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-white/70 hover:text-white transition-colors [&.active]:text-nyc-yellow [&.active]:font-semibold select-none cursor-pointer outline-none"
          >
            Dashboard
          </Link>
        </nav>
      </div>

      {/* Right side: User Profile / Auth Action */}
      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        {isAuthenticated && user ? (
          <div>
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex items-center gap-3 rounded-full border border-white/20 bg-white/5 py-1.5 px-3 hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-nyc-yellow"
            >
              {user.avatar && user.avatar !== failedAvatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || "User Avatar"}
                  onError={() => setFailedAvatar(user.avatar)}
                  className="h-8 w-8 rounded-full object-cover border border-nyc-yellow/50"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-nyc-yellow text-nyc-ink font-bold text-sm">
                  {getInitial(user.name)}
                </div>
              )}
              <span className="text-sm font-medium text-white max-w-[120px] truncate hidden sm:inline-block">
                {user.name || user.email || "Account"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={`h-4 w-4 text-white/60 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/15 bg-[#121212] p-5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* About Section */}
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  {user.avatar && user.avatar !== failedAvatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || "User Avatar"}
                      onError={() => setFailedAvatar(user.avatar)}
                      className="h-11 w-11 rounded-full object-cover border-2 border-nyc-yellow"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-nyc-yellow text-nyc-ink font-bold text-lg">
                      {getInitial(user.name)}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-base font-semibold text-white truncate">
                      {user.name || user.email || "Your account"}
                    </span>
                    <span className="mt-0.5 text-xs text-white/60 truncate">
                      {user.email || "Signed in"}
                    </span>
                  </div>
                </div>

                {/* Account Details / About info */}
                <div className="py-3 text-xs text-white/70 space-y-1.5 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                      Active
                    </span>
                  </div>
                </div>

                {/* Logout Option */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.75}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/"
            className="rounded-full bg-nyc-yellow px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-nyc-ink transition hover:bg-[#ffe14a] active:translate-y-px select-none cursor-pointer outline-none"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
