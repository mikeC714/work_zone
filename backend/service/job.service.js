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
            throw new Error("Failed to fetch job info.", err);
        }
    }

    async allCompletedJobs(id){
        if(!id){
            throw new Error("ID of user is unprovided.", err);
        }
        try{
            const results = await this.db.query(
                `SELECT status, created_at
                    FROM quotes
                    WHERE user_id = $1
                    AND status = 'completed'
                    AND created_at >= $2
                    AND created_at < $3
                `, [id, startOfMonth, endOfMonth]
            );

            return {
                data: results.row
            }
        }catch(err){
            throw new Error("Failed to fetch all completed jobs.",err);
        }
    }

    async allUnpaidJobs(id){
        if(!id){
            throw new Error("ID of user is unprovided.", err);
        }
        try{
            const reslts = await this.db.query(
                `SELECT status, created_at
                    FROM quotes
                    WHERE user_id = $1
                    AND created_at >= $2
                    AND created_at < $3
                    AND status != 'completed'
                `, [id, startOfMonth, endOfMonth]
            );

            return {
                data: results.rows
            };
        }catch(err){
            throw new Error("Failed to fetch all unpaid jobs.", err);
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
                    AND status = 'approved'
                    AND created_at >= $2
                    AND created_at < $3
                `,[id, startOfMonth, endOfMonth] 
            );

            return {
                data: results.rows
            }
        }catch(err){
            throw new Error("Failed to fetch all active jobs", err);
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
                    AND status in ('approved', 'completed')
                    AND created_at >= $2
                    AND created_at < $3
                `, [id, startOfMonth, endOfMonth]
            );

            return {
                data: results.rows[0].totalValue
            };
        }catch(err){
            throw new Error("Failed to fetch monthly total", err);
        }    
    }

}

export default new JobService(db);