import { Resend } from 'resend';
import { AppError } from '../error/error.handler.js';
import { pdf } from "../public/pdfTemplate.js";
import { quoteEmailTemplate } from "../public/emailTemplate.js";

const resend = new Resend(process.env.RESEND_KEY)

	export async function sendEmail({ userInfo, data, link, expiry }){
		const senderName = `${userInfo.first_name} ${userInfo.last_name} `;
		try{
        	if(!data) throw new AppError("Failed to provide quote data. Cannot send empty quote.", 400);
			const pdfBuffer = await pdf({ quoteInfo: data, user: userInfo });

			const { error } = await resend.emails.send({
                from: `${senderName}  <noreply@field-hq.com>`,
                to: data.customer.email,
                subject: 'Quote',
				html: quoteEmailTemplate({ userInfo, data, link, senderName, expiry }) ,
				attachments: [
					{
						filename: `quote.pdf`,
						content: pdfBuffer.toString("base64")
					}
				]
            });
            if(error) throw error;
		}catch(err){
			throw err;
		}
	};

