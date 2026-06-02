import Notis from '../service/notifications.service.js';
import customerService from '../service/customer.service.js';
import QuoteService from "../service/quote.service.js";
import db from "../config/postgresql.config.js";

export async function allNotifications(req,res){
    const user = req.user;
    const page = parseInt(req.query.notiPage);
    const limit = parseInt(req.query.notiLimit);
    const clear = req.query.clear;
    const offset = (page - 1) * limit;
    
    const customerIds = await customerService.getAllCustomerIds(user);
    const customerDetails = await customerService.customerDetails(customerIds, user);
    const { notis, total } = await Notis.getNotis(user,  customerDetails, limit, offset);

    if(clear === "true"){
        notis.forEach(noti => {
            console.log("TRIGGERED")
            noti.read = true;
        })
    }

    const nonRead = notis.filter((noti) => noti.read !== true);
    const totalPages = Math.ceil(total/limit);
    
    return res.status(200).json({
        success: true,
        nonRead,
        paginated:{
            page,
            total,
            totalPages,
            nextPage: page < Math.ceil(total/limit),
            prevPage: page > 1
        }
    })
}

