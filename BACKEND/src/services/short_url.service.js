import { generateNanoId } from "../utils/helper.js";
import {
    getShortUrl as getShortUrlFromDao,
    saveShortUrl,
} from "../dao/short_url.js";

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

export const getShortUrl = async (id) => {
    return await getShortUrlFromDao(id);
};
