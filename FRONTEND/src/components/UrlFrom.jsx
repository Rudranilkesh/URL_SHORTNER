import { useState } from "react";
import { useSelector } from "react-redux";
import { createShortUrl } from "../api/shortUrl.api";

export default function UrlFrom() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const destinationUrl = url.trim();
    if (!destinationUrl) {
      setError("Enter a URL to shorten.");
      return;
    }
    if (slug && !/^[a-zA-Z0-9_-]+$/.test(slug)) {
      setError("Custom slug can only contain letters, numbers, hyphens and underscores.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      setShortUrl(await createShortUrl(destinationUrl, slug || undefined));
      setSlug("");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Could not shorten this URL.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-10 max-w-3xl" noValidate onSubmit={handleSubmit}>
      <label className="mb-2 block text-sm font-medium" htmlFor="long-url">Destination URL</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input className="min-w-0 flex-1 rounded-lg border border-white/25 bg-white px-4 py-4 text-base text-nyc-ink outline-none" id="long-url" onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com/a-very-long-link" required type="url" value={url} />
        <button className="rounded-lg bg-nyc-yellow px-6 py-4 font-semibold text-nyc-ink disabled:opacity-60" disabled={isLoading} type="submit">{isLoading ? "Shortening..." : "Shorten URL"}</button>
      </div>
      {isAuthenticated ? <div className="mt-3"><label className="mb-1 block text-xs text-white/60" htmlFor="custom-slug">Custom slug (optional)</label><input className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none" id="custom-slug" onChange={(event) => setSlug(event.target.value)} placeholder="my-custom-slug" value={slug} /></div> : null}
      {error ? <p className="mt-3 text-sm text-red-300" role="alert">{error}</p> : null}
      {shortUrl ? <div className="mt-7 rounded-xl bg-nyc-yellow p-5 text-nyc-ink"><p className="text-sm font-semibold">Your short link is ready</p><a className="mt-2 block break-all font-bold underline" href={shortUrl} rel="noreferrer" target="_blank">{shortUrl}</a></div> : null}
    </form>
  );
}
