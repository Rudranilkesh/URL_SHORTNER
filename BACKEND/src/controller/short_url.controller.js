import {
  createShortUrlWithoutUser,
  createShortUrlWithUser,
  getShortUrl,
} from "../services/short_url.service.js";
import { BadRequestError, NotFoundError } from "../utils/errorHandler.js";

export const createShortUrl = async (req, res) => {
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

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new BadRequestError("URL must use http or https");
  }

  let shortUrl;
  if (req.user) {
    shortUrl = await createShortUrlWithUser(url, req.user._id);
  } else {
    shortUrl = await createShortUrlWithoutUser(url);
  }
  res.status(200).json({ shortUrl: process.env.APP_URL + shortUrl });
};

export const redirectFromShortUrl = async (req, res) => {
  const { id } = req.params;
  const url = await getShortUrl(id);

  if (!url) {
    throw new NotFoundError("Short URL not found");
  }

  res.redirect(url.full_url);
};
