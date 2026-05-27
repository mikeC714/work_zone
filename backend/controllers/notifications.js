import Notis from '../service/notifications.service.js';
import { CustomerService, CustomerInfo } from '../service/customer.service.js';
import QuoteService from "../service/quote.service.js";
import db from "../config/postgresql.config.js";

export async function allNotifications(req,res){
    const user = req.user;
    const page = parseInt(req.query.notiPage);
    const limit = parseInt(req.query.notiLimit);
    const clear = req.query.clear;


    const offset = (page - 1) * limit;
    try{
        const customerIds = await CustomerInfo.getAllCustomerIds(user);
        const customerDetails = await CustomerService.customerDetails(customerIds, user);
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
    }catch(err){
        res.status(500).json({
            success: false,
            message: `Failed to get All Notis: ${err.message}`
        })
    }
}

