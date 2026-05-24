import QuoteService from "../service/quote.service";

export async function monitorQuotes(req, res){
    const user = req.user;
    if(!user){
        return res.status(401).json({ message: "Unauthorized user. Failed to provide user ID" });
    }
    try{
        await QuoteService.monitorQuotes(user)
    }catch(err){
        return res.status(500).json({ error: err.message })
    }
}