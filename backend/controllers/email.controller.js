import { Resend } from 'resend';
import { supabase } from '../config/supabase.config.js';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_KEY)

export async function sendQuoteEmail(req,res){
    user = req.user;
    const { quoteId } = req.params;
    const { customerEmail } = req.body;

    if(!user){
        return res.status(401).json({
            success: false,
            error: `User is unauthorized`
        })
    }

    try{
        const { data, error } = await resend.emails.send({
            from: user.email,
            to: customerEmail,
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