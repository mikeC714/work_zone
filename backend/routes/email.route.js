import express from 'express';
import { sendQuoteEmail, quoteResponse } from '../controllers/email.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js'

const emailRouter = express.Router();

emailRouter.post('/quote/send', requireAuth ,sendQuoteEmail);
emailRouter.get('/quote/respond', quoteResponse);