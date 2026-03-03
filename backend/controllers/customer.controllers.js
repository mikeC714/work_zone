import { customerInfo, customerQuoteInfo, customerStatus } from "../service/customer.service.js";
import { getCustomerId } from '../utils/getCustomer.js';


export async function getCustomerInfo(req,res){
    try{
        const customerId = await getCustomerId(req.user);
        const customerDetails = await customerInfo(customerId)

        return res.status(200).json({
            success: true,
            customerDetails
        })

    }catch(error){
        console.error(error.message);
        return res.status(500).json({
            success: false, 
            error: error.message
        })
    }
}

export async function getCustomerQuoteInfo(req,res){
    try{
        const customerId = await getCustomerId(req.user);
        const customerQuoteDetails = await customerQuoteInfo(customerId, req.user)

        return res.status(200).json({
            success: true,
            customerQuoteDetails
        })
    }catch(error){
        console.error(error.message);
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export async function getCustomerStatus(req,res){
    try {
        const customerId = await getCustomerId(req.user);
        const customerStatusDetails = await customerStatus(customerId, req.user);

        return res.status(200).json({
            success: true,
            customerStatusDetails
        })
    }catch(error){
        console.error(error.message);
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}