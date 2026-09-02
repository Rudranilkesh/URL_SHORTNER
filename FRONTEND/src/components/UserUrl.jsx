import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUserUrls } from "../api/user.api";

const truncate = (value, length) => value?.length > length ? `${value.slice(0, length)}...` : value;

export default function UserUrl() {
  const { data: links = [], isLoading, isError, error } = useQuery({
    queryKey: ["userUrls"],
    queryFn: getAllUserUrls,
    refetchInterval: 30000,
    staleTime: 0,
  });
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (url, id) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
    }
  };

  const totalClicks = links.reduce((total, link) => total + (link.clicks ?? 0), 0);
  const topClicks = links.length ? Math.max(...links.map((link) => link.clicks ?? 0)) : 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Total Links" value={links.length} />
        <StatCard label="Total Clicks" value={totalClicks} />
        <StatCard label="Best Link Clicks" value={topClicks} />
      </div>
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">My Links</p>
          <span className="text-[10px] text-white/35">{links.length} total</span>
        </header>
        {isLoading ? <p className="py-20 text-center text-sm text-white/40">Loading links...</p> : null}
        {isError ? <p className="py-20 text-center text-sm text-red-400">{error?.response?.data?.message || "Failed to load links. Please refresh."}</p> : null}
        {!isLoading && !isError && links.length === 0 ? <p className="py-20 text-center text-sm text-white/45">No links yet. Go to Home to shorten your first URL.</p> : null}
        {!isLoading && !isError && links.length > 0 ? (
          <div className="links-scrollbar min-h-0 flex-1 overflow-auto"><table className="w-full text-sm"><thead><tr className="border-b border-white/10 text-left text-[10px] font-semibold uppercase tracking-wider text-white/35"><th className="px-6 py-2.5">Short URL</th><th className="hidden px-6 py-2.5 sm:table-cell">Original URL</th><th className="px-6 py-2.5 text-center">Clicks</th><th className="px-6 py-2.5 text-right">Copy</th></tr></thead><tbody>
            {links.map((link) => {
              const shortUrl = `${window.location.protocol}//${window.location.hostname}:3000/${link.short_url}`;
              return <tr className="border-b border-white/5 hover:bg-white/[0.04]" key={link._id}><td className="px-6 py-3"><a className="font-semibold text-nyc-yellow hover:underline" href={shortUrl} rel="noreferrer" target="_blank">/{link.short_url}</a></td><td className="hidden px-6 py-3 text-white/45 sm:table-cell" title={link.full_url}>{truncate(link.full_url, 48)}</td><td className="px-6 py-3 text-center">{link.clicks ?? 0}</td><td className="px-6 py-3 text-right"><button className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-white/60 hover:border-nyc-yellow hover:text-nyc-yellow" onClick={() => handleCopy(shortUrl, link._id)} type="button">{copiedId === link._id ? "Copied" : "Copy"}</button></td></tr>;
            })}
          </tbody></table></div>
        ) : null}
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"><p className="text-2xl font-bold text-white">{value}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/50">{label}</p></div>;
}
