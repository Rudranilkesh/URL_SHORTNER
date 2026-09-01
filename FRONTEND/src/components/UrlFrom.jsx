import { useState } from "react";
import { useSelector } from "react-redux";
import { createShortUrl } from "../api/shortUrl.api";

function UrlFrom() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedUrl = url.trim();
    const trimmedSlug = slug.trim();

    if (!trimmedUrl) {
      setError("Enter a URL to shorten.");
      return;
    }

    // slug validation: only alphanumeric, hyphens, underscores
    if (trimmedSlug && !/^[a-zA-Z0-9_-]+$/.test(trimmedSlug)) {
      setError("Custom slug can only contain letters, numbers, hyphens and underscores.");
      return;
    }

    setError("");
    setShortUrl("");
    setIsCopied(false);
    setIsLoading(true);

    try {
      const newShortUrl = await createShortUrl(trimmedUrl, trimmedSlug || undefined);
      setShortUrl(newShortUrl);
      setSlug("");
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message || requestError.message || "Something went wrong."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setIsCopied(true);
    } catch {
      setError("Could not copy the link. Please copy it manually.");
    }
  };

  return (
    <>
      <form className="mt-10 max-w-3xl" onSubmit={handleSubmit} noValidate>
        <label className="mb-2 block text-sm font-medium" htmlFor="long-url">
          Destination URL
        </label>

        {/* ── URL input + button row ── */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="min-w-0 flex-1 rounded-lg border border-white/25 bg-white px-4 py-4 text-base text-nyc-ink outline-none transition placeholder:text-nyc-muted focus-visible:border-nyc-yellow focus-visible:ring-4 focus-visible:ring-nyc-yellow/30 disabled:cursor-not-allowed disabled:opacity-70"
            id="long-url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com/a-very-long-link"
            aria-describedby={error ? "url-error" : "url-help"}
            aria-invalid={Boolean(error)}
            disabled={isLoading}
            required
          />
          <button
            className="rounded-lg bg-nyc-yellow px-6 py-4 font-semibold text-nyc-ink transition hover:bg-[#ffe14a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Shortening..." : "Shorten URL"}
          </button>
        </div>

        {/* ── custom slug field — only shown when authenticated ── */}
        {isAuthenticated && (
          <div className="mt-3">
            <label
              htmlFor="custom-slug"
              className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/60"
            >
              <i className="ri-fingerprint-line text-nyc-yellow text-sm"></i>
              Custom slug
              <span className="text-white/35">(optional)</span>
            </label>
            <div className="flex items-center rounded-lg border border-white/15 bg-white/5 px-4 py-3 transition focus-within:border-nyc-yellow focus-within:ring-2 focus-within:ring-nyc-yellow/20 max-w-xs">
              <span className="shrink-0 select-none text-sm text-white/35 pr-1">ryl.io/</span>
              <input
                id="custom-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-custom-slug"
                disabled={isLoading}
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25 disabled:opacity-60"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-white/35">
              Letters, numbers, hyphens and underscores only.
            </p>
          </div>
        )}

        <p className="mt-3 text-sm text-white/55" id="url-help">
          Only valid HTTP and HTTPS links can be shortened.
        </p>
        {error ? (
          <p className="mt-3 text-sm font-medium text-red-300" id="url-error" role="alert">
            {error}
          </p>
        ) : null}
      </form>

      {shortUrl ? (
        <section
          className="mt-7 max-w-3xl rounded-xl border border-nyc-yellow/60 bg-nyc-yellow p-5 text-nyc-ink"
          aria-live="polite"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.14em]">Your short link is ready</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a
              className="break-all text-lg font-bold underline decoration-2 underline-offset-4"
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
            >
              {shortUrl}
            </a>
            <button
              className="flex items-center gap-1.5 rounded-md border-2 border-nyc-ink px-4 py-2 text-sm font-semibold transition hover:bg-nyc-ink hover:text-nyc-yellow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-nyc-ink/35"
              type="button"
              onClick={handleCopy}
            >
              <i className={isCopied ? "ri-check-line" : "ri-file-copy-line"}></i>
              {isCopied ? "Copied" : "Copy link"}
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}

export default UrlFrom;
