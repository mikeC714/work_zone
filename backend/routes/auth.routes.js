import express from 'express';
import { login, signup, logout, currUser, deleteUserAcc } from '../controllers/auth.controllers.js';
import { authLimiter } from '../middleware/ratelimiter.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/auth/signup', authLimiter, signup);
authRouter.post('/auth/login', authLimiter, login);
authRouter.post('/auth/logout', verifyToken, logout);
authRouter.delete('/auth/delete', verifyToken, deleteUserAcc);
authRouter.get('/auth/me', verifyToken, currUser);


export default authRouter;
