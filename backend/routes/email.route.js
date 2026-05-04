import express from 'express';
import Auth from '../middleware/auth.middleware.js';
import EmailControllers from "../controllers/email.controller.js";
import { authLimiter } from '../middleware/ratelimiter.js';

const emailRouter = express.Router();

emailRouter.post('/quote/send', authLimiter, EmailControllers.handleSending);
emailRouter.get('/quote/accept', EmailControllers.handleAcceptance);


export default emailRouter;