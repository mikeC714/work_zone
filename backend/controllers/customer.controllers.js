import { CustomerInfo, CustomerService } from "../service/customer.service.js";
import JobService from "../service/job.service.js";
import QuoteService from "../service/quote.service.js";

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
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const offset = (page -1) * limit;
            
            const { customers } = await CustomerInfo.getAllCustomerInfo(user);
            console.log("CUSTOMERS",customers)

            const totalCustomers = customers.length;
            const paginatedCustomers = customers.slice(offset, offset + limit);

            console.log("PAGINATED CUSTOMERS:",paginatedCustomers);
            
            const quoteDetails = await QuoteService.getQuoteInfo(paginatedCustomers, user)

            

            console.log("QUOTE DETAILS:",quoteDetails);

            const jobDetails = await JobService.getJobInfo(quoteDetails);

            // console.log("Page:" ,page)
            // console.log("Limit:" ,limit)
            // console.log("Offset:",offset)
            // console.log("Customer Ids:", [customerIds]);
            // console.log("Total Customers: ",totalCustomers);
            // console.log("Chunk of customers:" ,paginatedCustomers);
            // console.log("Job Data:", jobDetails.data);
            
            const cusData = customers.map(customer => {
                console.log([...customer]);
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
                cusData,
                paginated: {
                    paginatedCustomers,
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
            const customerIds = await CustomerInfo.getAllCustomerIds(user);
            const quotes = await QuoteService.getQuoteInfo(customerIds, user);
            console.log("Quotes:", quotes);
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

            const newQuote = await CustomerService.createQuote(user, customer, quote, labor, materials);
            console.log(req.user)
            console.log("New Quote:", newQuote)

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