import express from 'express';
import AuthController from '../controllers/auth.controllers.js';
import { authLimiter } from '../middleware/ratelimiter.js';
import AuthMiddleware from '../middleware/auth.middleware.js';
import auth from '../auth/auth.js';

const authRouter = express.Router();

authRouter.post('/auth/signup', authLimiter, AuthController.signup);
authRouter.post('/auth/login', authLimiter, AuthController.login);
authRouter.post('/auth/logout', AuthMiddleware.verifyToken, AuthController.logout);
authRouter.delete('/auth/delete', AuthMiddleware.verifyToken, AuthController.deleteUser);


export default authRouter;