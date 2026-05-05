import { encrypt, decrypt } from "../../utils/encrypt.js";
import db from "../../config/postgresql.config.js";

class TokenService{
    #db
    constructor(db){
        this.#db = db;
    }

    /*
        TOKEN METHODS ARE EXPECTING THE TOKEN TO BE ENCRYPTED ON ARRIVAL.
        getStoredToken will return an encrypted refreshToken so if the method is being used the 
        token will have to be decrypted if token contents are needed
    */

    async storeRefreshToken(id, token){
        if(!token){
            throw new Error("Expired refresh token.");
        }
        if(!id){
            throw new Error("Unauthorized user.");
        }
        try{
            await this.#db.query(
                `INSERT INTO tokens(user_id, token) 
                VALUES($1, $2)`,
                [id, token]
            )
        }catch(err){
            throw new Error(err.message);
        }
    }

    async deleteRefreshToken(userId, token){
        if(!userId){
            throw new Error("Invalid User.");
        }
        if(!token){
            throw new Error("Unauthorized.");
        }
        try{
            await this.#db.query(
                "DELETE FROM tokens WHERE token = $1 AND user_id = $2",
                [token, userId]
            );
        }catch(err){
            throw new Error(err.message);
        }
    }

    async getRefreshToken(id){
        if(!id){
            throw new Error("Invalid user.");
        }
        try{
            return await this.#db.query(
                "SELECT token FROM refresh_tokens WHERE user_id = $1",
                [id]
            );
        }catch(err){
            throw new Error("Failed to get user's token.", err.message)
        }
    }

    async storeQuoteToken(id, token){
        if(!id){
            throw new Error("Invalid user.");
        }
        if(!token){
            throw new Error("Quote token is unprovided.");
        }
        try{
            await this.#db.query(
                "INSERT INTO quote_tokens (quote_id, token) VALUES($1, $2)",
                [id, token]
            );
        }catch(err){
            throw new Error("Failed to store quote token.", err.message);
        }
    }

    async getQuoteToken(id, quoteId){
        if(!id){
            throw new Error("Invalid user");
        }
        if(!cusEmail){
            throw new Error("Customer email was not provided.");
        }
        try{
            const token = await this.#db.query(
                `SELECT token FROM quote_tokens
                WHERE user_id = $1
                AND quote_id = $2
                `, [id, quoteId]
            )
            return{
                token: token.rows
            }
        }catch(err){
            throw new Error("Failed to get quote token", err.message);
        }
    }
}

export default new TokenService(db);