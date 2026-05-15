import Notis from '../service/notifications.service.js';
import { CustomerService, CustomerInfo } from '../service/customer.service.js';
import db from "../config/postgresql.config.js";

export async function allNotifications(req,res){
    const user = req.user;
    try{
        const customerIds = await CustomerInfo.getAllCustomerIds(user);
        const customerInfo = await CustomerService.customerDetails(customerIds, user)
        const notifications = await Notis.getNotis(user, customerInfo)

        return res.status(200).json({
            success: true,
            notifications
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: `Failed to get All Notis: ${err.message}`
        })
    }
}

