import { Resend } from 'resend';
import db from "../config/postgresql.config.js";

const resend = new Resend(process.env.RESEND_KEY)



class EmailService{
    constructor(db){
        this.db = db;
    }
    // Email sent with a link
    // The endpoint will store the JWT token within the param 
    // Once the endpoint is triggered the token is then split to get it's payload
    // The payload contents (user.id, and customer email) will then be used to query to change the status of the customers quote
    // The link will the redirect the user to a blank page thanking them for acceptance of the quote
    // 

    async send(user, quoteData, link){
        if(!user){
            throw new Error("Invalid user.");
        }
        if(!quoteData){
            throw new Error("Quote data is not provided cannot send empty quote.");
        }
        try{
            console.log(quoteData);
            const { data, error } = await resend.emails.send({
                from: user.email,
                to: quoteData.customer.email,
                subject: `Quote from ${user.name}`,
                html: `${quoteData}`,
                html: `<a href="${link}"> Click the link to accept your quote!`
                
            });
            if(error){
                throw new Error("Failed to create email.");
            }
            console.log(data)

            return {
                data
            }
        }catch(err){
            throw new Error(err.message);
        }
    }



    async quoteResponse(req,res){
    const { token, action } = req.query;
    
        try{
            const { data, error } = await supabase
                .from('quotes')
                .select('token')
                .eq('token', token)
                .single()
        
        
            if(error || !data){
                return res.status(500).json({
                    success: false,
                    error: `Quote not found ${error.message}`
                })
            }
        
            const { error: updateQuoteStatusError } = await supabase
                .from('quotes')
                .update({ status: action })
                .eq('token', token)
        
            if(updateQuoteStatusError){
                return res.status(500).json({
                    success: false,
                    error: `Failed to Update Quote Status ${updateQuoteStatusError.message}`
                })
            }
        
            return res.status(200).json({
                success: true,
                message: 'Quote status has successfully been updated '
            })
        
        }catch(error){
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    }
}

export default new EmailService(db);