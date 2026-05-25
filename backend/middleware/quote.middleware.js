import QuoteService from "../service/quote.service.js";

export async function monitorQuotes(req, res, next){
    const user = req.user;
    if(!user){
        return res.status(401).json({ message: "Unauthorized user. Failed to provide user ID" });
    }
    try{
        await QuoteService.monitorQuotes(user);
        next();
    }catch(err){
        next(err);
    }
}