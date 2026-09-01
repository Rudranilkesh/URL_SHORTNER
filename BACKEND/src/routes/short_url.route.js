import express from 'express';
import { createShortUrl, createCustomShortUrl, get_user_links } from '../controller/short_url.controller.js';
import { tryCatchWrapper } from '../utils/tryCatchWrapper.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const router = express.Router();


router.post("/", tryCatchWrapper(createShortUrl));
router.post("/custom", tryCatchWrapper(createCustomShortUrl));
router.get("/links", authMiddleware, tryCatchWrapper(get_user_links));

export default router;
