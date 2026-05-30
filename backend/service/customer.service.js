import QuoteService from "./quote.service.js";
import JobService from "./job.service.js";
import db from "../config/postgresql.config.js";


class customerInfo{
    constructor(db){
        this.db = db;
    }

    async getAllCustomerIds(userId){
        if(!userId){
            throw new Error("Invalid user. Failed to get all customer Ids.");
        }    
        try{
            const results = await this.db.query(
                `SELECT id FROM customers WHERE user_id = $1`,
                [userId]
            );
            return results.rows;
        }catch(err){
            throw new Error(`Failed to fetch all customer ids:${err.message}.`)
        }
    }

    async getAllCustomerInfo(userId){
        if(!userId){
            throw new Error("Invalid user. Failed to fetch all customer info.");
        }
        try{
            const results = await this.db.query(
                `SELECT * FROM customers 
                WHERE user_id = $1
                `,[userId]
            );

            if(!results){
                return {
                    data: []
                }
            }
            
            return{
                customers: results.rows,
            }
            
        }catch(err){
            throw new Error(err.message)
        }
    }
}

class customerService{
    constructor(db){
        this.db = db;
    }
    async customerDetails(customerIds, userId){
        if(!userId){ 
            throw new Error("Invalid user. Failed to fetch customer detials.");
        }

        const cusIds = customerIds.map(customer => customer.id);

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
            return results.rows;
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
                quotes.map(async quote => {
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
}

const CustomerService = new customerService(db);
const CustomerInfo = new customerInfo(db);

export {
    CustomerService,
    CustomerInfo
}
