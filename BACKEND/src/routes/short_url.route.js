import express from 'express';
import { createShortUrl } from '../controller/short_url.controller.js';
import { tryCatchWrapper } from '../utils/tryCatchWrapper.js';
const router = express.Router();


router.post("/", tryCatchWrapper(createShortUrl));

export default router;
