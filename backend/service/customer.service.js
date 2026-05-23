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

            return {
                customerIds: results.rows
            };
        }catch(err){
            throw new Error(`Failed to fetch all customer ids:${err.message}.`)
        }
    }

    async getAllCustomerInfo(userId, limit, offset){
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

    async customerStatus(quotes){
        if(!quotes || quotes.length === 0){
            return {
                quotes: [], status: null
            }
        }

        return (quotes ?? []).reduce((acc, val) => {
            const key = val.status;
            return{
                ...acc,
                [key]: [...(acc[key] ?? []), val]
            }
        }, {})        
    }

    async createQuote(user, customer, quote, labor, materials){
        try{
            const customerData = await this.db.query(
                `INSERT INTO customers 
                    (user_id, first_name, last_name, phone, email, address)
                VALUES($1, $2, $3, $4, $5, $6)
                RETURNING id`, 
                [user, customer.firstName, customer.lastName, customer.phone, customer.email, customer.address]
            );

            const quoteData = await this.db.query(
                `INSERT INTO quotes
                    (user_id, customer_id, status, markup, total)
                VALUES($1, $2, $3, $4, $5)    
                RETURNING id`, 
                [user, customerData?.rows[0]?.id, quote.status, quote.markup, quote.total]
            );

            const [
                laborData,
                materialsData
            ] = await Promise.all([
                    labor.map(labVals => 
                        this.db.query(
                        `INSERT INTO labor
                            (quote_id, description, hours, hourly_rate, total)
                        VALUES($1, $2, $3, $4, $5)
                        `, [quoteData?.rows[0]?.id, labVals.description, labVals.hours, labVals.hourlyRate, labVals.total]
                    )),
                    materials.map(matVals =>
                        this.db.query( 
                        `INSERT INTO materials
                            (quote_id, description, quantity, unit_cost, total)
                        VALUES($1, $2, $3, $4, $5)
                        `, [quoteData?.rows[0]?.id, matVals.description, matVals.quantity, matVals.unitCost, matVals.total]
                    ))
            ]);
            
            // NOTHING NEEDS TO BE RETURNED SINCE THIS IS ONLY INSERTING DATA

            return {
                customerId: customerData.rows[0].id,
                quoteId: quoteData.rows[0].id
            };
        }catch(err){
            throw new Error(`Failed to insert quote: ${err.message}`);
        }
    }


    async deleteQuote(quoteId, userId){
        try{
            return await this.db.query(
                `DELETE FROM quotes WHERE user_id = $1 AND id = $2`,
                [userId, quoteId]
            );
        }catch(err){
            throw new Error(`Failed to delete quote: ${err.message}`);
        }
        
    }
}

const CustomerService = new customerService(db);
const CustomerInfo = new customerInfo(db);

export {
    CustomerService,
    CustomerInfo
}