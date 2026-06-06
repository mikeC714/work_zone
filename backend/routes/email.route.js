import express from 'express';
import { handleSending, handleAcceptance } from "../controllers/email.controller.js";
import { authLimiter } from '../middleware/ratelimiter.js';

const emailRouter = express.Router();

emailRouter.post('/quote/send', authLimiter, handleSending);
emailRouter.get('/quote/acceptance', handleAcceptance);


export default emailRouter;
