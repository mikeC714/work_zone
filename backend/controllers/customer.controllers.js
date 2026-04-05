import { CustomerService} from "../service/customer.service.js";
import { getCustomerId, getAllCustomerIds } from '../utils/getCustomer.js';
import { getQuoteInfo, getJobInfo } from "../utils/getQuote.js";
import { db } from '../config/supabase.config.js'

const customerService = new CustomerService(db)

export async function getCustomerInfo(req,res){
    try{
        const customerId = await getCustomerId(req.user);
        const customerDetails = await customerService.customerInfo(customerId)

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
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const offset = (page - 1) * limit;

            const customerIds = await getAllCustomerIds(req.user);
            const totalCustomers = customerIds.length;

            const paginatedCustomers = customerIds.slice(offset, offset + limit);
            
            const [ quoteDetails, customerDetails ] = await Promise.all([
                getQuoteInfo(paginatedCustomers, req.user),
                customerService.customerInfo(paginatedCustomers, req.user)
            ])
            const jobDetails = await getJobInfo(quoteDetails) 

            const customers = customerDetails.map(customer => {
                return{
                    ...customer,
                    quote: quoteDetails.filter(quote => quote.customer_id === customer.id).map(quotes => {
                        return{
                            ...quotes,
                            job: jobDetails.filter(job => job.quote_id === quotes.id)
                       }
                    })
                }
            })

         return res.status(200).json({
                success: true,
                customers,
                paginated:{
                    totalCustomers,
                    page,
                    limit,
                    totalPages: Math.ceil(totalCustomers / limit),
                    nextPage: page < Math.ceil(totalCustomers / limit),
                    prevPage: page > 1
                }
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
        const customerQuoteDetails = await customerService.customerQuoteInfo(customerId, req.user)

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
        const customerStatusDetails = await customerService.customerStatus(customerId, req.user);

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

        const newQuote = await customerService.createQuote(user, customer, quote, labor, materials, createdAt);

        if(newQuote.error){
            return res.status(500).json({
                success: false,
                error: newQuote.error.message
            })
        }

        console.log(newQuote)

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
        const deletedQuote = await customerService.deleteQuote(quoteId, user.id);

        if(deletedQuote.error){
            console.error(`Failed to Delete Customer Quote ${quoteId}`);
            return res.status(500).json({
                success: false,
                error: deletedQuote.error.message
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