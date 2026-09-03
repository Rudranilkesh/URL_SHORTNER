import urlSchema from "../models/short_url.model.js";

export const saveShortUrl = async (shortUrl, longUrl, userId) => {
    const newUrl = new urlSchema({
        full_url: longUrl,
        short_url: shortUrl,
    });

    if (userId) {
        newUrl.user = userId.toString();
    }

    return await newUrl.save();
};

export const getShortUrl = async (shortUrl) => {
    return await urlSchema.findOneAndUpdate(
        { short_url: shortUrl },
        { $inc: { clicks: 1 } },
        { returnDocument: "after" }
    );
};

// get custom url
export const getCustomUrl = async (slug) => {
    return await urlSchema.findOne({ short_url: slug });
}

// get all urls for a specific user
export const getUrlsByUser = async (userId) => {
    return await urlSchema.find({ user: userId.toString() }).sort({ _id: -1 });
};
