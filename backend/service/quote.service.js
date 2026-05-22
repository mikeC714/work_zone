import db from "../config/postgresql.config.js";

class QuoteService{
    constructor(db){
        this.db = db;
    }
    
    async getQuoteInfo(customers, userId, filter, limit, offset){
        if(!userId){
            throw new Error("Invalid user, user id is not provided.");
        }

        if (!customers || customers.length === 0) {
            return { data: [] };
        }
        const cusIds = customers.map(c => c.id);

        try{
            const results = filter !== "ALL" ? 
            (
                await this.db.query(
                `SELECT
                    id,
                    customer_id,
                    status,
                    total,
                    markup,
                    created_at,
                COUNT(*) OVER() AS total_count
                FROM quotes
                WHERE user_id = $1
                AND status = $2
                AND customer_id = ANY ($3::uuid[])
                ORDER BY created_at DESC
                LIMIT $4 OFFSET $5
                `, [userId, filter, cusIds, limit, offset]
            )
            ):(
                await this.db.query(
                    `SELECT
                        id,
                        customer_id, 
                        status,
                        total,
                        markup,
                        created_at,
                    COUNT(*) OVER() AS total_count
                    FROM quotes
                    WHERE user_id = $1
                    AND customer_id = ANY ($2::uuid[])
                    ORDER BY created_at DESC
                    LIMIT $3 OFFSET $4
                    `, [userId, cusIds, limit, offset]
                ) 
            )

            console.log(results.rows[0].total_count)

            return {
                quoteDetails: results.rows,
                total: results.rows[0].total_count ? parseInt(results.rows[0].total_count): 0
            }
        }catch(err){
            throw new Error(err.message);
        }
    }

    async changeQuoteStatus(quoteId){
        if(!quoteId){
            throw new Error("Quote id not provided. Cannot alter quote status without it's id.");
        }
        try{    
            await this.db.query(
                `UPDATE quotes 
                SET status = 'SENT'
                WHERE id = $1
                `, [quoteId]
            )
        }catch(err){
            throw new Error(err.message);
        }
    }
}

export default new QuoteService(db);