import Auth from "../auth/auth.js";
import EmailService from "../service/email.service.js";
import { encrypt, decrypt } from "../utils/encrypt.js";
import QuoteService from "../service/quote.service.js";

class EmailControllers{
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
    async handleSending(req, res){
        const user = req.user;
        const data = req.body;

        if(!data){
            return res.status(400).json({ message: "Missing data feild. Cannot " })
        }

        const decrypted = decrypt(data.token);
        const valid = Auth.verifyEmail(decrypted);
        if(!valid){
            return res.status(400).json({ message: "Token provided is invalid." });
        }

        try{
            const link = `http://${process.env.PORT}/quote/accept?token=${data.token}`
            const status = "SENT";
            
            await QuoteService.changeQuoteStatus(data.id, status);
            await EmailService.send(user, data, link);

            return res.status(200).json({ success: true, message: "Successfully sent quote." });
        }catch(err){
            return res.send("Failed to send email. Please try again.")
        }
    }

    async handleAcceptance(req, res){
        const token = req.query.token;
        if(!token){
           return res.status(400).json({ message: "Invalid token, token may have expired." });
        }

        const decrypted = decrypt(token);
        const valid = Auth.verifyEmail(decrypted);
        if(!valid){
            return res.status(400).json({ message: "Token provided is invalid." });
        }

        try{
            const status = "Approved";
            await QuoteService.changeQuoteStatus(valid.payload.quoteId, status);
            return res.sendFile(path.join(__dirname, 'public/thank-you.html'));
        }catch(err){
            throw new Error("Failed to accept quote.");
            return res.sendFile(path.join(__dirname, 'public/failed.html'))
        }
    }
}

export default new EmailControllers();