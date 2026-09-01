import { Link } from '@tanstack/react-router';

export default function NavBar() {
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

      {/* Right side: Auth Action */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-nyc-yellow px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-nyc-ink transition hover:bg-[#ffe14a] active:translate-y-px select-none cursor-pointer outline-none"
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}
