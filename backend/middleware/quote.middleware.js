import { AuthenticationError } from "../error/error.handler.js";
import QuoteService from "../service/quote.service.js";

export async function monitorQuotes(req, res, next){
    try{
		const user = req.user;
		if(!user) throw new AuthenticationError("Unauthorized user. Failed to provide user ID");
        await QuoteService.monitorQuotes(user);
        next();
    }catch(err){
        next(err);
    }
}
