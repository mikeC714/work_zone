import { Resend } from 'resend';
import { CustomerService } from '../service/customer.service.js';
import { supabase } from '../config/supabase.config.js';
import dotenv from 'dotenv';
dotenv.config();

const customerService = new CustomerService(supabase)

const resend = new Resend(process.env.RESEND_KEY)

export async function sendQuoteEmail(req,res){
    const user = req.user;
    const { customer, labor, materials, quote } = req.body;
   
    if(!user){
        return res.status(401).json({
            success: false,
            error: `User is unauthorized`
        })
    }
    
    const { quoteData } = await customerService.createQuote(user, customer, labor, materials, quote);

    const acceptQuote = `http://localhost:3000/api/quote/respond?token=${quoteData.token}&action=accepted`
    const declineQuote = `http://localhost:3000/api/quote/respond?token=${quoteData.token}&action=declined` 
    
    try{

        const { data, error } = await resend.emails.send({
            from: user.email,
            to: customer.email,
            subject: `Quote From ${user.name}`
            // html IMPORT JSX COMPONENT OF THE EMAIL FORMAT
        });

        if(error){
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }

        return res.status(200).json({
            success: true,
            data
        })

    }catch(error){
        console.error(`Failed to send email: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export async function quoteResponse(req,res){
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