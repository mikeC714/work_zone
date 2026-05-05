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
                data: results.rows
            };
        }catch(err){
            throw new Error(err.message);
        }
    }

    async allCompletedJobs(id){
        if(!id){
            throw new Error("ID of user is unprovided.");
        }
        try{
            const results = await this.db.query(
                `SELECT status, created_at
                    FROM quotes
                    WHERE user_id = $1
                    AND status = 'Completed'::status_type
                    AND created_at >= $2
                    AND created_at < $3
                `, [id, startOfMonth, endOfMonth]
            );
            console.log(results.rows);

            return {
                data: results.rows
            }
        }catch(err){
            throw new Error(err.message);
        }
    }

    async allUnpaidJobs(id){
        if(!id){
            throw new Error("ID of user is unprovided.", err);
        }
        try{
            const results = await this.db.query(
                `SELECT status, created_at
                    FROM quotes
                    WHERE user_id = $1 
                    AND created_at >= $2
                    AND created_at < $3
                    AND status != 'Completed'::status_type
                `, [id, startOfMonth, endOfMonth]
            );
            console.log(results.rows);

            return {
                data: results.rows
            };
        }catch(err){
            throw new Error(err.message);
        }
    }

    async allActiveJobs(id){
        if(!id){
            throw new Error("ID of user is unprovided.", err);
        }
        try{
            const results = await this.db.query(
                `SELECT status, created_at
                    FROM quotes
                    WHERE user_id = $1
                    AND status = 'Accepted'::status_type
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

    async fetchMonthlyTotal(id){
        if(!id){
            throw new Error("ID of user is unprovided.", err);
        }
        try{
            const results = await this.db.query(
                `SELECT SUM(total) AS totalValue, status, created_at
                    FROM quotes
                    WHERE user_id = $1
                    AND created_at >= $2
                    AND created_at < $3
                    GROUP BY status
                `, [id, startOfMonth, endOfMonth]
            );

            return {
                data: results.rows[0].totalValue
            };
        }catch(err){
            throw new Error(err.message);
        }    
    }

}

export default new JobService(db);