import express from 'express';
import { createShortUrl, createCustomShortUrl } from '../controller/short_url.controller.js';
import { tryCatchWrapper } from '../utils/tryCatchWrapper.js';
const router = express.Router();


router.post("/", tryCatchWrapper(createShortUrl));
router.post("/custom", tryCatchWrapper(createCustomShortUrl));

export default router;
