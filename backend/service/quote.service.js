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

    async changeQuoteStatus(quoteId, status){
        if(!quoteId){
            throw new Error("Quote id not provided. Cannot alter quote status without it's id.");
        }
        try{    
            await this.db.query(
                `UPDATE quotes 
                SET status = $1
                WHERE id = $2
                `, [status, quoteId]
            )
        }catch(err){
            throw new Error(err.message);
        }
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

    async monitorQuotes(userId){
        if(!userId){
            throw new Error("Failed to provide user Id");
        }
        if(!quotes){
            throw new Error("Failed to provide quotes to monitor");
        }

        try{
            const { rows: quotes } = await this.db.query(
                `SELECT 
                    id,
                    status,
                    created_at
                    FROM quotes
                    WHERE user_id = $1
                `, [userId]
            );


            const overDueQuotes = quotes.filter((qt) => {

                if(qt.status !== "APPRVOED") return;

                const sevenDays = 7 * 24 * 60 * 60 * 1000;
                const createdAt = qt.created_at.split("T");
                const createdMs = new Date(createdAt).getTime();
                const now = Date().now();
                const diff = now - createdMs;

                return diff >= sevenDays;
            }).map(qt => qt.id);

            // IF NO OVERDUE QUOTES RETURN

            if(!overDueQuotes.length) return ;

            await this.db.query(
                `UPDATE quotes
                    SET status = 'UNPAID'
                    WHERE id = ANY($1::uuid[])
                `, [overDueQuotes]
            );

        }catch(err){
            throw new Error(err.message);
        }
    }
}

export default new QuoteService(db);