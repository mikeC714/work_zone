import express from 'express';
import AuthController from '../controllers/auth.controllers.js';
import { limiter } from '../middleware/ratelimiter.js';
import AuthMiddleware from '../middleware/auth.middleware.js';

export const authRouter = express.Router();

authRouter.post('/signup', limiter, AuthController.signup);
authRouter.post('/login', limiter, AuthController.login);
authRouter.post('/logout', AuthMiddleware.verifyToken, AuthController.logout);

// ## MAKE A METHOD TO DELETE USER
authRouter.delete('/delete', AuthMiddleware.verifyToken, AuthController.deleteUser);