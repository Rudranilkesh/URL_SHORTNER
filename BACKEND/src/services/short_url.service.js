import { generateNanoId } from "../utils/helper.js";
import {
    getShortUrl as getShortUrlFromDao,
    saveShortUrl,
    getUrlsByUser as getUrlsByUserFromDao,
} from "../dao/short_url.js";

import { ConflictError } from "../utils/errorHandler.js";

export const createShortUrlWithoutUser = async (url) => {
    const shortUrl = await generateNanoId(7);
    await saveShortUrl(shortUrl, url);
    return shortUrl;
} 

export const createShortUrlWithUser = async (url, userId, slug=null) => {
    const shortUrl = slug || generateNanoId(7);
    if (slug) {
        const exists = await getShortUrlFromDao(slug);
        if(exists){
            throw new ConflictError("This custom url already exists");
        }
    }
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

export const getUrlsByUser = async (userId) => {
    return await getUrlsByUserFromDao(userId);
};
