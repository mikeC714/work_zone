import QuoteService from "./quote.service.js";
import JobService from "./job.service.js";
import db from "../config/postgresql.config.js";


class CustomerInfo{
    constructor(db){
        this.db = db;
    }

    async getAllCustomerIds(userId){
        if(!userId){
            throw new Error("Invalid user.");
        }    
        try{
            const results = await this.db.query(
                `SELECT customer_id FROM customers WHERE id = $1`,
                [userId]
            );
            return {
                customerIds = results.rows
            };
        }catch(err){
            throw new Error(`Failed to fetch all customer ids:${err.message}.`)
        }
    }
}

class CustomerService{
    constructor(db){
        this.db = db;
    }
    async customerDetails(customerIds, userId){
        if(!userId) throw new Error("Invalid user.", err)
        const cusIds = customerIds.map(customer => customer.id)
        if(!cusIds || customerIds === 0) return { customerInfo: [] };
        try{
            const results = await this.db.query(
                `SELECT 
                    id,
                    first_name,
                    last_name,
                    phone,
                    email,
                    address,
                    created_at
                FROM customers
                WHERE user_id = $1
                AND id = ANY($2)
                `, [userId, cusIds]
            );
            return {
                customerInfo: results.rows
            };
        }catch(err){
            throw new Error(`Failed to fetch customer info: ${err.message}`);
        }
    }

    async customerQuoteInfo(quotes, user){
        if(!quotes || quotes.length === 0){
            return {
                quotes: [], jobs: []
            }
        }
        try{
            const quotedJobs = await Promise.all(
                quotes.map(quote => {
                    const jobInfo = await JobService.getJobInfo([quote]);
                    return {
                        ...quote,
                        job: jobInfo
                    }
                })
            );
            return {
                quotedJobs
            };
        }catch(err){
            throw new Error(`Failed to get customer quote info: ${err.message}`);
        }
    }

    async customerStatus(quotes, user){
        // const quotes = await QuoteService.getQuoteInfo([customer], user);
        if(!quotes || quotes.length === 0){
            return {
                quotes: [], status: null
            }
        }

        const approvedStatus = quotes.filter(quote => quote.status === 'approved');
        const pendingStatus = quotes.filter(quote => quote.status === 'pending');
        const completedStatus = quotes.filter(quote => quote.status === 'completed');
        const declinedStatus = quotes.filter(quote => quote.status === 'declined');

        return {
            approvedStatus,
            pendingStatus,
            completedStatus,
            declinedStatus
        }
    }

    async createQuote(user, customer, quote, labor, materials, createdAt){
        try{
            const customerData = await this.db.query(
                `INSERT INTO customers 
                    (user_id, first_name, last_name, phone, email, address, created_at)
                VALUES($1, $2, $3, $4, $5, $6, $7)
                `, [user.id, customer.firstName, customer.lastName, customer.phone, customer.email, customer.address, customer.createdAt]
            );

            const quoteData = await this.db.query(
                `INSERT INTO quotes
                    (user_id, customer_id, status, markup, total, created_at)
                VALUES($1, $2, $3, $4, $5, $6, $7)    
                `, [user.id, customer.id, quote.status, quote.markup, quote.total, createdAt]
            );

            const [
                laborData,
                materialsData
            ] = await Promise.all([
                labor.map(labVals => 
                    this.db.query(
                    `INSERT INTO labor
                        (quote_id, description, hours, hourly_rate, total, created_at)
                    VALUES($1, $2, $3, $4, $5, $6)
                    `, labVals
                )),
                materials.map(matVals =>
                    this.db.query( 
                    `INSERT INTO quote
                        (quote_id, description, quantity, unit_cost, created_at)
                    VALUES($1, $2, $3, $4, $5)
                    `, matVals
                ))
            ]);

            return {
                customerData,
                quoteData,
                laborData,
                materialsData
            };
        }catch(err){
            throw new Error(`Failed to insert quote: ${err.message}`);
        }
    }


    async deleteQuote(quoteId, userId){
        try{
            const results = await this.db.query(
                `DELETE FROM quotes WHERE user_id = $1 AND quote_id = $2`,
                [userId, quoteId]
            );
            return { success: true };
        }catch(err){
            throw new Error(`Failed to delete quote: ${err.message}`);
        }
        
    }
}

export default new CustomerService(db);
export default new CustomerInfo(db);