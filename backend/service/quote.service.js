import db from "../config/postgresql.config.js";

class QuoteService{
    constructor(db){
        this.db = db;
    }
    
    async getQuoteInfo(customerIds, id){
        if(!id){
            throw new Error("Invalid user, user id is not provided.");
        }
        if (!customerIds || customerIds.length === 0) {
            return { data: [] };
        }
        const cusIds = customerIds.map(customer => customer.id);
        try{
            const results = await this.db.query(
                `SELECT
                    id,
                    customer_id, 
                    status,
                    total,
                    markup,
                    material_id,
                    labor_id,
                    created_at
                FROM quotes
                WHERE user_id = $1
                AND customer_id = ANY ($2)
                `, [id, cusIds]
            ) 
            return {
                data: results.rows
            }
        }catch(err){
            throw new Error("Failed to fetch quote info.", err);
        }
    }
}

export default new QuoteService(db);