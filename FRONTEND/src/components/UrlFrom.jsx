import { useState } from "react";
import { createShortUrl } from "../api/shortUrl.api";

function UrlFrom() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError("Enter a URL to shorten.");
      return;
    }

    setError("");
    setShortUrl("");
    setIsCopied(false);
    setIsLoading(true);

    try {
      const newShortUrl = await createShortUrl(trimmedUrl);
      setShortUrl(newShortUrl);
    } catch (requestError) {
      setError(requestError.message);
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
        <section className="mt-7 max-w-3xl rounded-xl border border-nyc-yellow/60 bg-nyc-yellow p-5 text-nyc-ink" aria-live="polite">
          <p className="text-sm font-semibold uppercase tracking-[0.14em]">Your short link is ready</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a className="break-all text-lg font-bold underline decoration-2 underline-offset-4" href={shortUrl} target="_blank" rel="noreferrer">
              {shortUrl}
            </a>
            <button
              className="rounded-md border-2 border-nyc-ink px-4 py-2 text-sm font-semibold transition hover:bg-nyc-ink hover:text-nyc-yellow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-nyc-ink/35"
              type="button"
              onClick={handleCopy}
            >
              {isCopied ? "Copied" : "Copy link"}
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}

export default UrlFrom;
