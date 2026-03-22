import { Notis } from '../service/notifications.service.js';
import { supabase } from '../config/supabase.config.js';

const notis = new Notis(supabase)

export async function allNotifications(req,res){
    const user = req.user;
    try{
        const notifications = await notis.getNotis(user)
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