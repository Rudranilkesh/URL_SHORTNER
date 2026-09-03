import {
  createShortUrlWithoutUser,
  createShortUrlWithUser,
  createCustomShortUrl as createCustomShortUrlService,
  getShortUrl,
  getUrlsByUser,
} from "../services/short_url.service.js";
import { BadRequestError, NotFoundError } from "../utils/errorHandler.js";

const buildShortUrl = (shortUrl, req) => {
  const configuredUrl = process.env.APP_URL?.trim();
  const baseUrl = configuredUrl || `${req.protocol}://${req.get("host")}`;

  return `${baseUrl.replace(/\/+$/, "")}/${shortUrl}`;
};

export const createShortUrl = async (req, res) => {
  const data = req.body;
  const slug = typeof data.slug === "string" ? data.slug.trim() : "";
  let shortUrl;

  if (slug) {
    shortUrl = await createCustomShortUrlService(
      data.url,
      slug,
      req.user?._id,
    );
  } else if (req.user) {
    shortUrl = await createShortUrlWithUser(data.url, req.user._id);
  } else {
    shortUrl = await createShortUrlWithoutUser(data.url);
  }
  res.status(200).json({ shortUrl: buildShortUrl(shortUrl, req) });
};


export const redirectFromShortUrl = async (req, res) => {
  const { id } = req.params;
  const url = await getShortUrl(id);

  if (!url) {
    throw new NotFoundError("Short URL not found");
  }

  res.redirect(url.full_url);
};


// create custom url
export const createCustomShortUrl = async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== "string") {
    throw new BadRequestError("A URL is required");
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new BadRequestError("Please provide a valid URL");
  }

  if (!["http:", "https:",].includes(parsedUrl.protocol)) {
    throw new BadRequestError("URL must use http or https");
  }

  let shortUrl;
  if (req.user) {
    shortUrl = await createCustomShortUrlService(url, req.body.slug, req.user._id);
  } else {
    shortUrl = await createCustomShortUrlService(url, req.body.slug);
  }
  res.status(200).json({ shortUrl: buildShortUrl(shortUrl, req) });
};

export const get_user_links = async (req, res) => {
  const links = await getUrlsByUser(req.user._id);
  res.status(200).json({ links });
};
