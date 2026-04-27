import encrypt from "../../utils/crypto.js";
import db from "../../config/postgresql.config.js";

class UserService{
    #db
    constructor(db) {
       this.#db = db; 
    }

    static async storeNewUser(username, email, safePassword){
        if(!username || !email || !password){
            throw new Error("Missing user field.");
        }
        try{
            const newUser = await this.#db.query(
                "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
                [username, email, safePassword]
            );
            return newUser;
        }catch(err){
            throw new Error(err.message);
        }
    }

    static async getUser(email){
        if(!email){
            throw new Error("Missing field.");
        }
        try{
            return await this.#db.query(
                "SELECT id, email, password  FROM users WHERE email = $1",
                [email]
            )
        }catch(err){
            throw new Error("Failed to get user.", err);
        }
    }

    static async deleteUser(userId){
        if(!userId){
            throw new Error("Invalid user.");
        }
        try{
            const user = await this.db.query(
                `SELECT id FROM users WHERE id = $1`
                ,[userId]
            );
            if(user.rows.length === 0){
                throw new Error("Invalid user.");
            }

            await this.db.query(
                `DELETE FROM users WHERE userId = $1`,
                [userId]
            );
        }catch(err){
            throw new Error("Failed to delete user.", err);
        }
    }
}

export default new UserService(db);