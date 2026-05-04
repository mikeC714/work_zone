import Auth from "../auth/auth.js";
import EmailService from "../service/email.service.js";
import { encrypt, decrypt } from "../utils/encrypt.js";
import QuoteService from "../service/quote.service.js";

class EmailControllers{
    async handleSending(req, res){
        const user = req.user;
        const data = req.body;
        try{
            const token = await Auth.signEmail({userId: user.id, customerEmail: data.customer.email, quoteId: quoteData.id});
            const safeToken = await encrypt(token);
            await TokensService.storeQuoteToken(quoteData.id ,safeToken);

            await QuoteService.changeQuoteStatus(user.id, quoteData.id);

            const link = `http://${process.env.PORT}/quote/accept?token=${token}`

            const status = "Sent";

            await EmailService.send(user, data, link);
            await QuoteService.changeQuoteStatus(data.quote.id, status);
            
            return res.send("Email Successfully Sent!")
        }catch(err){
            return res.send("Failed to send email. Please try again.")
        }
    }

    async handleAcceptance(req, res){
        const token = req.query.token;
        if(!token){
           return res.status(400).json({ message: "Invalid token, token may have expired." });
        }
        try{
            const verified = await Auth.verifyEmail(token)
            const decoded = await Auth.decode(verified);

            const storedToken = await QuoteService.getQuoteToken(decoded.payload.userId, decoded.payload.quoteId);
            const decrypted = await decrypt(storedToken);
        
            const decodedStored = await Auth.decode(decrypted);
            const status = "Approved";

            if(decoded.payload.userId === decodedStored.payload.userId &&
                decoded.payload.customerEmail === decodedStored.payload.customerEmail
            ){
                await QuoteService.changeQuoteStatus(decoded.payload.id, status);
                return res.sendFle(path.join(__dirname, 'public/thank-you.html'));
            }
            return res.sendFile(path.join(__dirname, 'public/failed.html'))
        }catch(err){
            throw new Error("Failed to accept quote.");
        }
    }
}

export default new EmailControllers();