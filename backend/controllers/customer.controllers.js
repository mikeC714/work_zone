import { customerInfo, customerQuoteInfo, customerStatus, createQuote, deleteQuote } from "../service/customer.service.js";
import { getCustomerId, getAllCustomerIds } from '../utils/getCustomer.js';
import { getQuoteInfo, getJobInfo } from "../utils/getQuote.js";


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

export async function getAllUserCustomers(req,res){
    try{
            const customerIds = await getAllCustomerIds(req.user);
            const quoteDetails = await getQuoteInfo(customerIds, req.user)
            const jobDetails = await getJobInfo(quoteDetails) 
            const customerDetails = await customerInfo(customerIds, req.user) 
            
            const customers = customerDetails.map(customer => {
                return{
                    ...customer,
                    quote: quoteDetails.filter(quote => quote.customer_id === customer.id).map(quotes => {
                       return {
                        ...quotes,
                        job: jobDetails.filter(job => job.quote_id === quotes.id)
                       }
                    })
                }
            })

         return res.status(200).json({
                success: true,
                customers
            })

    }catch(error){
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

export async function createCustomerQuote(req,res){
    const { customer, labor, materials, quote } = req.body;
    try {
        const user = req.user;
        const createdAt = new Date().toISOString();

        const newQuote = await createQuote(user, customer, labor, materials, quote, createdAt);

        if(newQuote.error){
            return res.status(500).json({
                success: false,
                error: newQuote.error.message
            })
        }

        return {
            ...newQuote
        }
    }catch(error){
        console.error(`Failed to Create New Quote`);
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export async function deleteCustomerQuote(req,res){
    const { quoteId } = req.parms;
    const user = req.user;
    try{
        const deletedQuote = await deleteQuote(quoteId, user.id);

        if(deletedQuote.error){
            console.error(`Failed to Delete Customer Quote ${quoteId}`);
            return res.status(500).json({
                success: false,
                error: deleteQuote.error.message
            })
        }
        
        return res.status(200).json({
            success: true,
            message: `Quote ${quoteId} was successfully deleted`
        })

    }catch(error){
        console.error(`Error while Deleting Quote: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}