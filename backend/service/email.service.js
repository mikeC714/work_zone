import { Resend } from 'resend';
import { renderToStaticMarkup } from 'react-dom/server';	
import EmailTemplate from "../../frontend/src/pages/emailTemplate.jsx";
import { AppError } from '../error/error.handler.js';
import db from "../config/postgresql.config.js";

const resend = new Resend(process.env.RESEND_KEY)



    // Email sent with a link
    // The endpoint will store the JWT token within the param 
    // Once the endpoint is triggered the token is then split to get it's payload
    // The payload contents (user.id, and customer email) will then be used to query to change the status of the customers quote
    // The link will the redirect the user to a blank page thanking them for acceptance of the quote
    //



	export async function sendEmail(user, quoteData, link){
        if(!quoteData) throw new AppError("Failed to provide quote data. Cannot send empty quote.", 400);
		const html = renderToStaticMarkup(<EmailTemplate quoteInfo={quoteData} userInfo={user} link={link} />)
        try{
			const { data, error } = await resend.emails.send({
                from: user.email,
                to: quoteData.customer.email,
                subject: 'Quote',
               	html 
            });
            if(error){
                throw new Error(error.message);
            }
            console.log(data);
        }catch(err){
            throw err;
        }
    }

