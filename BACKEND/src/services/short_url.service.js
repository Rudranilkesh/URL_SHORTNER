import { generateNanoId } from "../utils/helper.js";
import {
    getShortUrl as getShortUrlFromDao,
    saveShortUrl,
} from "../dao/short_url.js";

import { ConflictError } from "../utils/errorHandler.js";

export const createShortUrlWithoutUser = async (url) => {
    const shortUrl = await generateNanoId(7);
    await saveShortUrl(shortUrl, url);
    return shortUrl;
} 

export const createShortUrlWithUser = async (url,userId) => {
    const shortUrl = await generateNanoId(7);
    await saveShortUrl(shortUrl, url, userId);
    return shortUrl;
} 

export const createCustomShortUrl = async (url, slug, userId) => {
    const existing = await getShortUrlFromDao(slug);
    if (existing) {
        throw new ConflictError("Slug already exists");
    }
    await saveShortUrl(slug, url, userId);
    return slug;
};

export const getShortUrl = async (id) => {
    return await getShortUrlFromDao(id);
};
