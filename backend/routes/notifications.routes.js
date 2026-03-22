import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js'
import { allNotifications } from "../controllers/notifications.js";

export const notiRouter = express.Router();

notiRouter.get('/notifications', requireAuth, allNotifications)