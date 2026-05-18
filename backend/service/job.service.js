import { startOfMonth, endOfMonth } from "../utils/date.js";
import db from "../config/postgresql.config.js";


class JobService{
    constructor(db){
        this.db = db;
    }

    

    async getJobInfo(quotes){
        if(!quotes){
            return { data: [] };
        }
        try{
            const quoteIds = quotes.map(qts => qts.id);

            const results = await this.db.query(
                `SELECT 
                    description, 
                    hours,
                    hourly_rate,
                    quote_id
                FROM labor
                WHERE quote_id = ANY ($1)
                `, [quoteIds]
            );

            return {
                data: results.rows || []
            };
        }catch(err){
            throw new Error(err.message);
        }
    }

    async allCompletedJobs(id){
        if(!id){
            throw new Error("ID of user is unprovided. Failed to fetch all COMPLETED jobs.");
        }
        try{
            const results = await this.db.query(
                `SELECT status, created_at
                    FROM quotes
                    WHERE user_id = $1
                    AND status = 'COMPLETED'::quote_status_type
                    AND created_at >= $2
                    AND created_at < $3
                `, [id, startOfMonth, endOfMonth]
            );

            return {
                data: results.rows
            }
        }catch(err){
            throw new Error(err.message);
        }
    }

    async allUnpaidJobs(id){
        if(!id){
            throw new Error("ID of user is unprovided. Failed to fetch all unpaid jobs.");
        }
        try{
            const results = await this.db.query(
                `SELECT status, created_at
                    FROM quotes
                    WHERE user_id = $1 
                    AND created_at >= $2
                    AND created_at < $3
                    AND status != 'COMPLETED'::quote_status_type
                `, [id, startOfMonth, endOfMonth]
            );

            return {
                data: results.rows
            };
        }catch(err){
            throw new Error(err.message);
        }
    }

    async allActiveJobs(id){
        if(!id){
            throw new Error("ID of user is unprovided. Failed to fetch all active jobs.");
        }
        try{
            const results = await this.db.query(
                `SELECT status, created_at
                    FROM quotes
                    WHERE user_id = $1
                    AND status = 'APPROVED'::quote_status_type
                    AND created_at >= $2
                    AND created_at < $3
                `,[id, startOfMonth, endOfMonth] 
            );
            

            return {
                data: results.rows
            }
        }catch(err){
            throw new Error(err.message);
        }
    }

    async getMonthlyTotal(id){
        if(!id){
            throw new Error("ID of user is unprovided. Failed to fetch monthly revenue.");
        }
        try{
            const results = await this.db.query(
                `SELECT SUM(total) AS totalValue, status, created_at
                    FROM quotes
                    WHERE user_id = $1
                    AND created_at >= $2
                    AND created_at < $3
                    GROUP BY status, created_at
                `, [id, startOfMonth, endOfMonth]
            );

            return {
                data: results.rows[0]?.totalValue ?? 0
            };
        }catch(err){
            throw new Error(err.message);
        }    
    }

}

export default new JobService(db);