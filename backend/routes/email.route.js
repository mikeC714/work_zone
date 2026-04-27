import express from 'express';
import Auth from '../middleware/auth.middleware.js';
import { sendQuoteEmail, quoteResponse } from '../controllers/email.controller.js';
import { limiter } from '../middleware/ratelimiter.js';

const emailRouter = express.Router();


emailRouter.post('/quote/send', Auth.verifyToken, limiter, sendQuoteEmail);
emailRouter.get('/quote/respond', quoteResponse);

export default emailRouter;