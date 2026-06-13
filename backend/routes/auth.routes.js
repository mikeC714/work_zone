import express from 'express';
import { login, signup, logout, currUser, deleteUserAcc, passwordReset } from '../controllers/auth.controllers.js';
import { authLimiter } from '../middleware/ratelimiter.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { sendPassReset } from "../service/email.service.js";

const authRouter = express.Router();

authRouter.get('/auth/me', verifyToken, currUser);
authRouter.post('/auth/signup', authLimiter, signup);
authRouter.post('/auth/login', authLimiter, login);
authRouter.post('/auth/logout', verifyToken, logout);
authRouter.post('/auth/forgot-password', sendPassReset);
authRouter.put('/auth/reset-password', passwordReset);
authRouter.delete('/auth/delete', verifyToken, deleteUserAcc);

export default authRouter;
