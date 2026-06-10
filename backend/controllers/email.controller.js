import Auth from "../auth/auth.js";
import tokenService from "../service/db/token.service.js";
import { sendEmail } from "../service/email.service.js";
import userService from "../service/db/user.service.js";
import quoteService from "../service/quote.service.js";
import { AuthenticationError } from "../error/error.handler.js";
import { catchAsync } from "../utils/catchAsync.js";

	export const handleSending = catchAsync(async(req, res) => { 
        const user = req.user;
        const { customer, labor, materials, quote } = req.body;

		const { quoteId, customerId } = await quoteService.createQuote(user, customer, quote, labor, materials);

		const emailToken = Auth.signEmail({ id: user, quoteId, customerId })
		const expiry = await tokenService.storeQuoteToken(quoteId, emailToken);
		const link = `http://${process.env.PORT}/quote/acceptance?token=${emailToken}`;


        const userInfo = await userService.getUserById(user);
        await sendEmail({ userInfo, quoteInfo: quote, materials, labor, customer, link, expiry });

		return res.status(200).json({ success: true });
    })

    export const handleAcceptance = catchAsync(async(req, res) => {
        const token = req.query.token;
        if(!token) throw new AuthenticationError("Failed to provide valid email token.");

        const valid = Auth.verifyEmail(token);
        const status = "APPROVED";
        await quoteService.changeQuoteStatus(valid.payload.quoteId, status);
        
		// return res.sendFile(path.join(__dirname, '../../frontend/dist/', 'index.html'));
	})
    
