import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/mongo.config.js";

import short_url from "./src/routes/short_url.route.js"

import { redirectFromShortUrl } from "./src/controller/short_url.controller.js"

import { errorHandler, NotFoundError } from "./src/utils/errorHandler.js";
import { tryCatchWrapper } from "./src/utils/tryCatchWrapper.js";

dotenv.config();
const app = express();

//post route - create sort url

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/create",short_url)


// get route - redirection

app.get("/:id", tryCatchWrapper(redirectFromShortUrl));

app.use((req, res, next) => {
    next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

app.use(errorHandler);

const startServer = async () => {
    await connectDB();
    app.listen(3000, () => {
        console.log("server is running on http://localhost:3000");
    });
};

startServer().catch((error) => {
    console.error("Unable to start server:", error);
    process.exit(1);
});


