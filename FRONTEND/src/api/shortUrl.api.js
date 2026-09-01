import axiosInstance from "../utlis/axiosinstance";

/**
 * Sends a request to create a short URL.
 * @param {string} url - The long destination URL.
 * @param {string} [slug] - Optional custom slug.
 * @returns {Promise<string>} The shortened URL.
 */
export const createShortUrl = async (url, slug) => {
  const body = { url };
  if (slug) body.slug = slug.trim();
  const response = await axiosInstance.post("/create", body);
  const newShortUrl =
    typeof response.data === "string" ? response.data : response.data.shortUrl;

  if (!newShortUrl) {
    throw new Error("The server did not return a short URL.");
  }

  return newShortUrl;
};

/**
 * Fetches all short URLs created by the currently authenticated user.
 * @returns {Promise<Array>} Array of link objects.
 */
export const getUserLinks = async () => {
  const { data } = await axiosInstance.get("/create/links");
  return data.links;
};