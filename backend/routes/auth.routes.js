import express from 'express';
import { signUp, login, logOut, deleteUser } from '../controllers/auth.controllers.js';
import { limiter } from '../middleware/ratelimiter.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const authRouter = express.Router();

authRouter.post('/logout', limiter, logOut);
authRouter.post('/signup', limiter, signUp);
authRouter.post('/login', limiter, login);
authRouter.delete('/delete', limiter, deleteUser)
authRouter.get('/session', requireAuth, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});