import db from "../config/postgresql.config.js";

class Notis {
    constructor(db) {
        this.db = db
    }
    async getNotis(user, customerDetails, limit, offset){
        try{ 
            const customerMap = new Map();
            
            customerDetails.forEach(cus => customerMap.set(cus.id, cus));

            const customers = customerDetails.map(cus => cus.id);


            const notis = []

            const results = await this.db.query(
                `SELECT 
                    id,
                    status,
                    created_at,
                    customer_id,
                    total,
                    COUNT(*) OVER() AS total_count
                    FROM quotes
                    WHERE user_id = $1
                    AND customer_id = ANY($2::uuid[])
                    AND status IN ('APPROVED', 'PENDING', 'UNPAID')
                    ORDER BY created_at DESC
                    LIMIT $3 OFFSET $4
                `,[user, customers, limit, offset]
            )

            if(results.rows.length === 0) return { notis: [] };

            const quotes = results.rows;

            console.log(quotes.length)

            quotes.forEach(qt => {
                const customer = customerMap.get(qt.customer_id);

                if(!customer) return  notis = [];

                if(qt.status === 'APPROVED'){
                    notis.push({
                        type: "Approved",
                        message: `${customer.first_name}, ${customer.last_name} has been approved.`,
                        quoteId: qt.id,
                        total:qt.total,
                        read: false
                    })
                }

                if((qt.status === 'PENDING')){
                    notis.push({
                        type: "Follow Up",
                        message: `${customer.first_name} hasn't accepted thier quote.`,
                        quoteId: qt.id,
                        total:qt.total,
                        read: false
                    })
                }

                if((qt.status === 'UNPAID')){
                    notis.push({
                        type: "Unpaid",
                        message: `${customer.first_name} hasn't paid their quote.`,
                        quoteId: qt.id,
                        total:qt.total,
                        read: false
                    })
                }
            })

            return {
                notis,
                total: results.rows[0].total_count ? parseInt(results.rows[0].total_count) : 0
            };

        }catch(err){
            throw new Error(`Failed to fetch notis: ${err.message}`);
        }
    }
}

export default new Notis(db);