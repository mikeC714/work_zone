import Auth from "../auth/auth.js";
import { sendEmail } from "../service/email.service.js";
import userService from "../service/db/user.service.js";
import quoteService from "../service/quote.service.js";
import { AuthenticationError } from "../error/error.handler.js";
import { catchAsync } from "../utils/catchAsync.js";

	export const handleSending = catchAsync(async(req, res) => { 
        const user = req.user;
		const data = req.body;
		const { token } = data;
		const { emailToken } = token;

        Auth.verifyEmail(emailToken);
        const link = `http://${process.env.PORT}/quote/acceptance?token=${token.emailToken}`;
		
		const status = 'SENT';

        const userInfo = await userService.getUserById(user);
        await quoteService.changeQuoteStatus(data.id, status) ;
        await sendEmail({ userInfo, data, link, expiry: token.expiry });

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
    
