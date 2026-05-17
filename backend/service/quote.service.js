import db from "../config/postgresql.config.js";

class QuoteService{
    constructor(db){
        this.db = db;
    }
    
    async getQuoteInfo(customers, userId){
        if(!userId){
            throw new Error("Invalid user, user id is not provided.");
        }

        if (!customers || customers.length === 0) {
            return { data: [] };
        }
        const cusIds = customers.map(c => c.id);

        console.log(cusIds)

        try{
            const results = await this.db.query(
                `SELECT
                    id,
                    customer_id, 
                    status,
                    total,
                    markup,
                    created_at
                FROM quotes
                WHERE user_id = $1
                AND customer_id = ANY ($2::uuid[])
                `, [userId, cusIds]
            )

            return {
                quoteDetails: results.rows
            }
        }catch(err){
            throw new Error(err.message);
        }
    }

    async changeQuoteStatus(quoteId, status){
        if(!quoteId){
            throw new Error("Quote id not provided. Cannot alter quote status without it's id.");
        }
        try{    
            await this.db.query(
                `UPDATE quotes 
                SET status = $1
                WHERE id = $2
                `, [quoteId, status]
            )
        }catch(err){
            throw new Error(err.message);
        }
    }
}

export default new QuoteService(db);