import { Resend } from 'resend';
import db from "../config/postgresql.config.js";

const resend = new Resend(process.env.RESEND_KEY)



    // Email sent with a link
    // The endpoint will store the JWT token within the param 
    // Once the endpoint is triggered the token is then split to get it's payload
    // The payload contents (user.id, and customer email) will then be used to query to change the status of the customers quote
    // The link will the redirect the user to a blank page thanking them for acceptance of the quote
    // 
	export async function sendEmail(user, quoteData, link){
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
                subject: `Quote from ${user.email}`,
                html: `${quoteData}`,
                html: `<a href="${link}"> Click the link to accept your quote!`
                
            });
            if(error){
                throw new Error(error.message);
            }
            console.log(data);
        }catch(err){
            throw new Error(err.message);
        }
    }

