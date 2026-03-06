import express from 'express';
import { sendQuoteEmail, quoteResponse } from '../controllers/email.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js'
import { limiter } from '../middleware/ratelimiter.js';

export const emailRouter = express.Router();

emailRouter.post('/quote/send', requireAuth, limiter, sendQuoteEmail);
emailRouter.get('/quote/respond', quoteResponse);