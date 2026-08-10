import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/mongo.config.js";

import short_url from "./src/routes/short_url.route.js"

import { redirectFromShortUrl } from "./src/controller/short_url.controller.js"

import { AppError, errorHandler, NotFoundError } from "./src/utils/errorHandler.js";
import { tryCatchWrapper } from "./src/utils/tryCatchWrapper.js";



dotenv.config();
const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new AppError("Origin is not allowed by CORS", 403));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));

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

