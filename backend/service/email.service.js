import { Resend } from 'resend';
import { AppError } from '../error/error.handler.js';
import { pdf } from "../public/pdfTemplate.js";
import { quoteEmailTemplate } from "../public/emailTemplate.js";
import { passwordResetEmailTemplate } from '../public/passwordResetTemplate.js';
const resend = new Resend(process.env.RESEND_KEY)

	export async function sendQuoteEmail({ userInfo, quoteInfo, materials, labor, customer, link, expiry }){
		const senderName = `${userInfo.first_name} ${userInfo.last_name} `;
		console.log(expiry);
		console.log("Sending email");
		try{
        	if(!quoteInfo) throw new AppError("Failed to provide quote info. Cannot send empty quote.", 400);
			const pdfBuffer = await pdf({ quoteInfo, materials, labor, user: userInfo, customer, expiry });
			console.log(pdfBuffer);	
			console.log("PDF buffer size:", pdfBuffer.length);
			

			const { error } = await resend.emails.send({
                from: `${senderName}  <noreply@field-hq.com>`,
                to: customer.email,
                subject: 'Quote',
				html: quoteEmailTemplate({ userInfo, customer, link, senderName, expiry }) ,
				attachments: [
					{
						filename: `quote.pdf`,
						content: pdfBuffer.toString("base64"),
						contentType:"application/pdf"
					}
				]
            });
			console.log(error);
            if(error) throw error;
		}catch(err){
			throw err;
		}
	};

	export async function sendPassReset(email, token){
		const link = `${process.env.FRONTEND_URL}/reset-pass?token=${token}`;
		try{
			const { error } = await resend.emails.send({
				from:`<noreply@feild-hq.com>`,
				to: email,
				subject: 'Password Reset',
				html:  passwordResetEmailTemplate({ link }),
			});
			if(error) throw error;
		}catch(err){
			throw err
		}
	}

