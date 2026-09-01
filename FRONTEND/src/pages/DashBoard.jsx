import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import NavBar from "../components/NavBar";
import { getUserLinks } from "../api/shortUrl.api";

/* ─── helpers ───────────────────────────────────────────────────── */
function truncate(str, n) {
  return str && str.length > n ? str.slice(0, n) + "…" : str;
}

function StatCard({ label, value, icon, accent }) {
  return (
    <div
      style={{ borderColor: accent + "44", background: accent + "0d" }}
      className="flex items-center gap-4 rounded-2xl border p-5 transition-transform duration-200 hover:scale-[1.02]"
    >
      <div
        style={{ background: accent + "22", color: accent }}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl"
      >
        <i className={icon}></i>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/50">
          {label}
        </p>
      </div>
    </div>
  );
}

function CopyCell({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };
  return (
    <button
      onClick={handle}
      type="button"
      title="Copy short URL"
      className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-white/60 transition hover:border-nyc-yellow hover:text-nyc-yellow focus-visible:outline-none flex items-center gap-1"
    >
      {copied
        ? <><i className="ri-check-line"></i> Copied</>
        : <><i className="ri-file-copy-line"></i> Copy</>}
    </button>
  );
}

/* ─── main page ─────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);

  const {
    data: links = [],
    isLoading: linksLoading,
    isError: linksError,
  } = useQuery({
    queryKey: ["userLinks"],
    queryFn: getUserLinks,
  });

  const totalLinks = links.length;
  const totalClicks = links.reduce((s, l) => s + (l.clicks || 0), 0);
  const topClicks = links.length
    ? Math.max(...links.map((l) => l.clicks || 0))
    : 0;

  return (
    <main className="min-h-screen bg-nyc-black px-4 py-6 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col rounded-[2rem] border border-white/15 bg-nyc-dark p-6 shadow-nyc sm:p-10">

        {/* ── navbar ── */}
        <NavBar />

        {/* ── greeting ── */}
        <div className="mt-10 mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nyc-yellow mb-1">
            Welcome back
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {user?.name ?? "Dashboard"}
            <span className="text-nyc-yellow">.</span>
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Track and manage all your shortened links from one place.
          </p>
        </div>

        {/* ── stat cards ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          <StatCard label="Total Links"      value={totalLinks}  icon="ri-links-line"   accent="#ffd600" />
          <StatCard label="Total Clicks"     value={totalClicks} icon="ri-cursor-line"  accent="#60a5fa" />
          <StatCard label="Best Link Clicks" value={topClicks}   icon="ri-trophy-line"  accent="#34d399" />
        </div>

        {/* ── links table ── */}
        <div className="flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
              <i className="ri-list-check mr-1.5"></i>My Links
            </p>
            <span className="text-[10px] text-white/35">{totalLinks} total</span>
          </div>

          {linksLoading ? (
            <div className="flex items-center justify-center py-20 text-sm text-white/40">
              <i className="ri-loader-4-line animate-spin mr-2 text-base"></i>
              Loading links…
            </div>
          ) : linksError ? (
            <div className="flex items-center justify-center py-20 text-sm text-red-400">
              <i className="ri-error-warning-line mr-2 text-base"></i>
              Failed to load links. Please refresh.
            </div>
          ) : links.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <i className="ri-link text-5xl text-white/20"></i>
              <p className="text-sm text-white/45">
                No links yet.{" "}
                <span className="text-nyc-yellow font-medium">
                  Go to Home to shorten your first URL!
                </span>
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-semibold uppercase tracking-wider text-white/35">
                    <th className="px-6 py-3 text-left">Short URL</th>
                    <th className="hidden px-6 py-3 text-left sm:table-cell">
                      Original URL
                    </th>
                    <th className="px-6 py-3 text-center">Clicks</th>
                    <th className="px-6 py-3 text-right">Copy</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link, i) => {
                    const appUrl =
                      window.location.protocol +
                      "//" +
                      window.location.hostname +
                      ":3000/" +
                      link.short_url;
                    return (
                      <tr
                        key={link._id ?? i}
                        className="border-b border-white/5 transition-colors hover:bg-white/[0.04]"
                      >
                        <td className="px-6 py-4">
                          <a
                            href={appUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-nyc-yellow hover:underline underline-offset-4"
                          >
                            /{link.short_url}
                          </a>
                        </td>
                        <td className="hidden px-6 py-4 sm:table-cell">
                          <span className="text-white/45" title={link.full_url}>
                            {truncate(link.full_url, 48)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
                            {link.clicks ?? 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <CopyCell text={appUrl} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── footer ── */}
        <footer className="mt-8 flex flex-col gap-2 border-t border-white/15 pt-5 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <span>Short links for the next thing you share.</span>
          <span>Copyright {new Date().getFullYear()} RYL</span>
        </footer>
      </section>
    </main>
  );
}
