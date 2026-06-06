import Auth from "../auth/auth.js";
import { sendEmail } from "../service/email.service.js";
import userService from "../service/db/user.service.js";
import quoteService from "../service/quote.service.js";
import { AppError, AuthenticationError } from "../error/error.handler.js";
import { catchAsync } from "../utils/catchAsync.js";
import path from "path";

    //  sendEmail({
    //                 id: data.id,
    //                 token: data.token,
    //                 customer: customerInfo,
    //                 quote: { markup: Number(userMarkup), total: Number(total.toFixed(2)) },
    //                 labor: labor.map(l => ({ ...l, hours: Number(l.hours), hourlyRate: Number(l.hourlyRate) })),
    //                 materials: materials.map(m => ({ ...m, quantity: Number(m.quantity), unitCost: Number(m.unitCost) }))
    //             });
    //         }
    // { id: user, quoteId, customerId }
	export const handleSending = catchAsync(async(req, res) => { 
        const user = req.user;
		const data = req.body;
		console.log(data)

        Auth.verifyEmail(data.token);
        const link = `http://${process.env.PORT}/quote/acceptance?token=${data.token}`;
		
        const userInfo = await userService.getUserById(user);
        const status = 'SENT'; 
        await quoteService.changeQuoteStatus(user, data.id, status) ;
        await sendEmail(userInfo, data, link);

        return res.status(200).json({ success: true });
    })

    export const handleAcceptance = catchAsync(async(req, res) => {
        const token = req.query.token;
        if(!token) throw new AuthenticationError("Failed to provide valid email token.");

        const valid = Auth.verifyEmail(token);
        const status = "APPROVED";
        await quoteService.changeQuoteStatus(valid.payload.quoteId, status);
        
		return res.sendFile(path.join(__dirname, '../../frontend/dist/', 'index.html'));
	})
    
