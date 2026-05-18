import { CustomerInfo, CustomerService } from "../service/customer.service.js";
import QuoteService from "../service/quote.service.js";
import JobService from "../service/job.service.js";
import Auth from "../auth/auth.js";
import TokenService from "../service/db/token.service.js"
import { encrypt } from "../utils/encrypt.js";

class CustomerControllers{
    
    async getCustomerInfo(req,res){
        const user = req.user;
        try{
            const customerId = await CustomerInfo.getAllCustomerIds(user);
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
            const page  = parseInt(req.query.page)  || 1;
            const limit = parseInt(req.query.limit) || 20;
            const offset = (page - 1) * limit;

            const { customers, total } = await CustomerInfo.getAllCustomerInfo(user, limit, offset);

            const { quoteDetails } = await QuoteService.getQuoteInfo(customers, user);

            const { data } = await JobService.getJobInfo(quoteDetails); 
            
            const cusData = customers.map(cus => {
                return{
                    ...cus,
                    quote: quoteDetails.filter(qt => qt.customer_id === cus.id).map(qts => {
                        return{
                            ...qts,
                            job: data.filter(job => job.quote_id === qts.id)
                        }
                    })
                }
            });


            const totalPages = Math.ceil(total / limit);

            return res.status(200).json({
                success: true,
                cusData,
                paginated: {
                    total,
                    page,
                    limit,
                    totalPages : Math.ceil(total / limit),
                    nextPage: page < Math.ceil(total / limit),
                    prevPage: page > 1
                }
            });
        }catch(err){
            return res.status(500).json({
                error:err.message
            });
        }
    }
 
    async getCustomerQuoteInfo(req, res){
        const user = req.user;
        try{
            const customerIds = await CustomerInfo.getAllCustomerIds(user);
            const quotes = await QuoteService.getQuoteInfo(customerIds, user);
            const customerQuoteDetails = await CustomerService.customerQuoteInfo(quotes, user)

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
            const customerIds = await CustomerService.getAllCustomerIds(user);
            const quotes = await QuoteService.getQuoteInfo(customerIds, user)
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

            const { customerId, quoteId } = await CustomerService.createQuote(user, customer, quote, labor, materials);
            
            const emailToken = await Auth.signEmail({ id: user, quoteId, customerId })
            const safeEmailToken = encrypt(emailToken);
            await TokenService.storeQuoteToken( quoteId, safeEmailToken);

            return res.status(200).json({
                success: true,
                token: safeEmailToken,
                id: quoteId
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
            const deletedQuote = await CustomerService.deleteQuote(quoteId, user);

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