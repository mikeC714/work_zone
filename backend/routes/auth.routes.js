import express from 'express';
import { login, signup, logout, currUser, deleteUser } from '../controllers/auth.controllers.js';
import { authLimiter } from '../middleware/ratelimiter.js';
import AuthMiddleware from '../middleware/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/auth/signup', authLimiter, signup);
authRouter.post('/auth/login', authLimiter, login);
authRouter.post('/auth/logout', AuthMiddleware.verifyToken, logout);
authRouter.delete('/auth/delete', AuthMiddleware.verifyToken, deleteUser);
authRouter.get('/auth/me', AuthMiddleware.verifyToken, currUser);


export default authRouter;
