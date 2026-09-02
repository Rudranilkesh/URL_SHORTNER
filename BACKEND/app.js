import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/mongo.config.js";

import user_routes from "./src/routes/user.route.js"
import short_url from "./src/routes/short_url.route.js"
import auth_routes from "./src/routes/auth.routes.js"

import { redirectFromShortUrl } from "./src/controller/short_url.controller.js"

import { AppError, errorHandler, NotFoundError } from "./src/utils/errorHandler.js";
import { tryCatchWrapper } from "./src/utils/tryCatchWrapper.js";

import { attachUser } from "./src/utils/attachUser.js";

import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

const app = express();
const __dirname = path.resolve();


const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
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
    credentials: true,
}));

//post route - create sort url
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(attachUser)
app.use("/api/auth",auth_routes)
app.use("/api/create",short_url)
app.use("/api/user",user_routes)
app.use(express.static(path.join(__dirname, "../FRONTEND/dist")));

const sendFrontend = (req, res) => {
    res.sendFile(path.join(__dirname, "../FRONTEND/dist/index.html"));
};

// Frontend routes must be handled before a short-code route such as /git.
app.get(["/", "/home", "/dashboard"], sendFrontend);

// Redirect short URLs before falling back to the React application.
app.get("/:id", tryCatchWrapper(redirectFromShortUrl));

app.get("/{*any}", sendFrontend);

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
