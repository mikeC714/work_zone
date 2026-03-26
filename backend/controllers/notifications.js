import { Notis } from '../service/notifications.service.js';
import { CustomerService } from '../service/customer.service.js';
import { getAllCustomerIds } from '../utils/getCustomer.js';
import { db } from '../config/supabase.config.js';

const notis = new Notis(db)
const cs = new CustomerService(db)

export async function allNotifications(req,res){
    const user = req.user;
    try{
        const customerIds = await getAllCustomerIds(user);
        const customerInfo = await cs.customerInfo(customerIds, user)
        const notifications = await notis.getNotis(user, customerInfo)

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