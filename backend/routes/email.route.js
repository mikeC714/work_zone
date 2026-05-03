import express from 'express';
import Auth from '../middleware/auth.middleware.js';
import { sendQuoteEmail, quoteResponse } from '../controllers/email.controller.js';
import { authLimiter } from '../middleware/ratelimiter.js';

const emailRouter = express.Router();

emailRouter.post('/quote/send', async (req, res) => {
    const user = req.user;
    
    const link = `http://${process.env.PORT}/quote/accepted`;

});
emailRouter.get('/quote/:accepted', async (req, res) => {
    const token  = req.params.token;
    const payload = await Auth.verifyEmailToken(token)


});


export default emailRouter;