import UrlFrom from "../components/UrlFrom";

function HomePage() {
  return (
    <main className="min-h-screen bg-nyc-black px-4 py-6 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col rounded-[2rem] border border-white/15 bg-nyc-dark p-6 shadow-nyc sm:p-10">
        <header className="flex items-center justify-between border-b border-white/15 pb-6">
          <a className="text-xl font-bold tracking-[-0.06em]" href="/" aria-label="RYL URL shortener home">
            RYL<span className="text-nyc-yellow">.</span>
          </a>
          <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
            Link tools
          </span>
        </header>

        <div className="flex flex-1 items-center py-12 sm:py-16">
          <div className="w-full">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-nyc-yellow">
              Fast. Simple. Shareable.
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.04] tracking-[-0.055em] sm:text-6xl">
              Make every link easier to share.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
              Paste a long URL and receive a concise link that is ready to send anywhere.
            </p>
            <UrlFrom />
          </div>
        </div>

        <footer className="flex flex-col gap-2 border-t border-white/15 pt-5 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <span>Short links for the next thing you share.</span>
          <span>Copyright {new Date().getFullYear()} RYL</span>
        </footer>
      </section>
    </main>
  );
}

export default HomePage;
