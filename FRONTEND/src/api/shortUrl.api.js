import axiosInstance from "../utlis/axiosinstance";

/**
 * Sends a request to create a short URL.
 * @param {string} url - The long destination URL.
 * @returns {Promise<string>} The shortened URL.
 */
export const createShortUrl = async (url) => {
  const response = await axiosInstance.post("/create", { url });
  const newShortUrl =
    typeof response.data === "string" ? response.data : response.data.shortUrl;

  if (!newShortUrl) {
    throw new Error("The server did not return a short URL.");
  }

  return newShortUrl;
};