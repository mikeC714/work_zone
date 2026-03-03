import express from 'express';
import { signUp, login, logOut } from '../controllers/auth.controllers.js';
import { limiter } from '../middleware/ratelimiter.js';

export const authRouter = express.Router();

authRouter.post('/signup', limiter, signUp);
authRouter.post('/login', limiter, login);
authRouter.post('/logout', limiter, logOut);