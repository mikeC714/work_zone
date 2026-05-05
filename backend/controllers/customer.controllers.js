import { CustomerInfo, CustomerService } from "../service/customer.service.js";
import JobService from "../service/job.service.js";
import QuoteService from "../service/quote.service.js";

class CustomerControllers{
    
    async getCustomerInfo(req,res){
        const user = req.user;
        try{
            const customerId = await CustomerInfo.getAllCustomerIds(user.payload.id);
            const customerDetails = await CustomerService.customerDetails(customerId)

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

    async getAllUserCustomers(req, res){
        const user = req.user;
        try{
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const offset = (page -1) * limit;

            const customerIds = await CustomerInfo.getAllCustomerIds(user.payload.id);
            const totalCustomers = customerIds.length;

            const paginatedCustomers = customerIds.slice(offset, offset + limit);
            
            const [ quoteDetails, customerDetails ] = await Promise.all([
                QuoteService.getQuoteInfo(paginatedCustomers, user.payload.id)
            ]);
            
            const jobDetails = await JobService.getJobInfo(quoteDetails);

            const customers = customerDetails.map(customer => {
                return{
                    ...customer,
                    quote: quoteDetails.map(qt => qt.customer.id === customer.id).map(qts => {
                        return{
                            ...qts,
                            job: jobDetails.filter(job => job.quote_id === qts.id)
                        }
                    })
                }
            });

            return res.status(200).json({
                success: true,
                customers,
                paginated: {
                    totalCustomers,
                    page,
                    limit,
                    totalPages : Math.ceil(totalCustomers / limit),
                    nextPage: page < Math.ceil(totalCustomers / limit),
                    prevPage: page > 1
                }
            });
        }catch(err){
            return res.status(500).json({
                error: `Failed to fetch all customers: ${err.message}`
            });
        }
    }
 
    async getCustomerQuoteInfo(req, res){
        const user = req.user;
        try{
            const customerIds = await CustomerInfo.getAllCustomerIds(user.payload.id);
            const quotes = await QuoteService.getQuoteInfo(customerIds, user.payload.id);
            const customerQuoteDetails = await CustomerService.customerQuoteInfo(quotes, user.payload.id)

            return res.status(200).json({
                customerQuoteDetails
            });
        }catch(err){
            return res.status(500).json({
                error: `Failed to get customers quote info: ${err.message}`
            });
        }
    }

    async getCustomerStatus(req, res){
        const user = req.user;
        try{
            const customerIds = await CustomerService.getAllCustomerIds(user.payload.id);
            const quotes = await QuoteService.getQuoteInfo(customerIds, user.payload.id)
            const customStatus = await CustomerService.customerStatus(quotes);

            return res.status(200).json({
                customerStatus
            });
        }catch(err){
            return res.status(500).json({
                error: `Failed to get customers stasus`
            });
        }
    }

    async createCustomerQuote(req, res){
        const { customer, labor, materials, quote } = req.body;
        const user = req.user;
        try{
            const createdAt = new Date().toISOString();

            const newQuote = await CustomerService.createQuote(user.payload.id, customer, quote, labor, materials, createdAt);
            
            return res.status(200).json({
                ...newQuote
            });

        }catch(err){
            return res.status(500).json({
                error: `Failed to create customer's quote: ${err.message}`
            });
        }
    }

    async deleteCustomerQuote(req,res){
        const { quoteId } = req.parms;
        const user = req.user;
        try{
            const deletedQuote = await CustomerService.deleteQuote(quoteId, user.payload.id);

            return res.status(200).json({
                message: `Quote ${quoteId} was successfully deleted.`
            });
        }catch(err){
            return res.status(500).json({
                error: `Failed to delete customer quote: ${err.message}`
            });
        }
    }
}

export default new CustomerControllers()