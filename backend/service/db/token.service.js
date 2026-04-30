import { encrypt } from "../../utils/encrypt.js";
import db from "../../config/postgresql.config.js";

class TokenService{
    #db
    constructor(db){
        this.#db = db;
    }

    static async storeRefreshToken(id, token){
        if(!token){
            throw new Error("Expired refresh token.");
        }
        if(!id){
            throw new Error("Unauthorized user.");
        }
        try{
            const safeToken = await encrypt(token);

            await this.#db.query(
                "UPDATE tokens SET token = $1 WHERE id = $2 AND expires_at = $3",
                [safeToken, id, token.expiry]
            )
        }catch(err){
            if(err){
                throw new Error("Failed to store user token", err);
            }
        }
    }

    static async deleteRefreshToken(userId, token){
        if(!userId){
            throw new Error("Invalid User.");
        }
        if(!token){
            throw new Error("Unauthorized.");
        }
        try{
            await this.#db.query(
                "DELETE FROM refresh_tokens WHERE token = $1 AND user_id = $2",
                [token, userId]
            );
            console.log(`${userId}'s token was successfully deleted`);
        }catch(err){
            throw new Error("Failed to delete token.", err);
        }
    }

    static async getRefreshToken(id){
        if(!id){
            throw new Error("Invalid user.");
        }
        try{
            return await this.#db.query(
                "SELECT token FROM refresh_tokens WHERE user_id = $1",
                [id]
            );
        }catch(err){
            throw new Error("Failed to get user's token.", err)
        }
    }
}

export default new TokenService(db);