import { wrapAsync } from "../utils/tryCatchWrapper.js";
import { getUrlsByUser } from "../services/short_url.service.js";



export const getAllUserUrls = wrapAsync(async (req, res) => {
    const {_id} = req.user;
    const urls = await getUrlsByUser(_id);
    res.status(200).json({ urls });
});
