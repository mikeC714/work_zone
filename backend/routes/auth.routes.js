import express from 'express';
import AuthController from '../controllers/auth.controllers.js';
import { authLimiter } from '../middleware/ratelimiter.js';
import AuthMiddleware from '../middleware/auth.middleware.js';
import auth from '../auth/auth.js';

const authRouter = express.Router();

authRouter.post('/signup', authLimiter, AuthController.signup);
authRouter.post('/login', authLimiter, AuthController.login);
authRouter.post('/logout', AuthMiddleware.verifyToken, AuthController.logout);
authRouter.delete('/delete', AuthMiddleware.verifyToken, AuthController.deleteUser);


export default authRouter;