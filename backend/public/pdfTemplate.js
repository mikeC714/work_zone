import puppeteer from "puppeteer";

export async function pdf ({ quoteInfo, materials, labor, user, customer, expiry }) {
	const browser = await puppeteer.launch({
		headless: "new",
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});
try{
	
	const page = await browser.newPage();

	const html = 
	`<!DOCTYPE html>
	<html>
		<body style="margin:0; padding:20px; background:#f4f4f4; font-family: Arial, sans-serif;">
		<div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden;">
  			<div style="background:#1a3a6b; padding:24px 32px; display:flex; justify-content:space-between; align-items:flex-start;">
			<div>
	  			<p style="margin:0; color:#fff; font-size:15px; font-weight:bold;">${user.first_name} ${user.last_name}</p>
	  			<p style="margin:4px 0 0; color:rgba(255,255,255,0.7); font-size:13px;">${user.email}</p>
			</div>
			<p style="margin:0; color:#fff; font-size:28px; font-weight:bold; letter-spacing:4px;">QUOTE</p>
  		</div>

  		<div style="padding:28px 32px;">

			<div style="display:flex; justify-content:space-between; margin-bottom:28px;">
	  		<div>
				<p style="margin:0 0 4px; font-size:11px; font-weight:bold; color:#1a3a6b; text-transform:uppercase; letter-spacing:0.5px;">Bill To</p>
				<p style="margin:0; font-size:18px; color:#333;">${customer.firstName} ${customer.lastName}</p>
				<p style="margin:4px 0 0; font-size:13px; color:#666;">${customer.address}</p>
	  		</div>
	  		<div style="text-align:right; font-size:13px;">
				<p style="margin:6px 0;"><strong style="color:#1a3a6b;">Quote date</strong>&nbsp;&nbsp;${quoteInfo.created_at}</p>
				<p style="margin:0;"><strong style="color:#1a3a6b;">Due date</strong>&nbsp;&nbsp;${expiry}</p>
	  		</div>
		</div>

	<table style="width:100%; border-collapse:collapse; font-size:13px;">
	  <thead>
		<tr style="background:#1a3a6b; color:#fff;">
		  <td style="padding:10px 12px; font-weight:bold; width:40px;">QTY</td>
		  <td style="padding:10px 12px; font-weight:bold;">Description</td>
		  <td style="padding:10px 12px; font-weight:bold; text-align:right;">Unit Price</td>
		  <td style="padding:10px 12px; font-weight:bold; text-align:right;">Amount</td>
		</tr>
	  </thead>
	  <tbody>
		${materials.map((item, i) => `
		<tr style="border-bottom:${i === materials.length - 1 ? '2px solid #1a3a6b' : '1px solid #eee'};">
		  <td style="padding:12px;">${item.qty}</td>
		  <td style="padding:12px;">${item.description}</td>
		  <td style="padding:12px; text-align:right;">${item.unitPrice}</td>
		  <td style="padding:12px; text-align:right;">${item.amount}</td>
		</tr>`).join('')}
	  </tbody>
	</table>

	<div style="display:flex; justify-content:flex-end; margin-top:16px;">
	  <table style="font-size:13px; min-width:220px;">
		<tr>
		  <td style="padding:5px 16px 5px 0; color:#666;">Subtotal</td>
		  <td style="padding:5px 0; text-align:right;">${quoteInfo.subtotal}</td>
		</tr>
		<tr style="border-top:2px solid #1a3a6b;">
		  <td style="padding:10px 16px 5px 0; font-weight:bold; color:#1a3a6b;">Total (USD)</td>
		  <td style="padding:10px 0 5px; text-align:right; font-weight:bold; color:#1a3a6b; font-size:15px;">${quoteInfo.total}</td>
		</tr>
	  </table>
	</div>

  </div>

  <div style="background:#1a3a6b; padding:14px 32px; text-align:center;">
	<p style="margin:0; color:rgba(255,255,255,0.7); font-size:12px;">This is an automatically generated quote. Please do not reply to this email.</p>
  </div>

</div>
</body>
</html>
`;

	await page.setContent(html, {waitUntil: 'networkidle0'  });
	
	const pdfBuffer = await page.pdf({
    	format: 'A4',
    	printBackground: true,    	
		margin: {
      		top: '20mm',
      		bottom: '20mm',
      		left: '15mm',
      		right: '15mm'
    	}
 	 });

		return pdfBuffer;
	}catch(err){
		console.trace(err);
		console.log(err.message);
		throw err;
	}finally{
		await browser.close();
	}
}


