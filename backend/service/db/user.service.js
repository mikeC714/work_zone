import { encrypt } from "../../utils/encrypt.js";
import db from "../../config/postgresql.config.js";

class UserService{
    #db
    constructor(db) {
       this.#db = db; 
    }

    async storeNewUser(firstName, lastName, email, password){
        if(!firstName || !lastName || !email || !password){
            throw new Error("Missing user field.");
        }
        try{
            const newUser = await this.#db.query(
                "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email",
                [firstName, lastName, email, password]
            );
            console.log(newUser);
            return newUser.rows[0]; 
        }catch(err){
            throw new Error(err.message);
        }
    }

    async getUser(email){
        if(!email){
            throw new Error("Missing field.");
        }
        try{
            return await this.#db.query(
                "SELECT id, first_name, last_name, email, password FROM users WHERE email = $1",
                [email]
            )
        }catch(err){
            throw new Error("Failed to get user.", err);
        }
    }

    async getUserById(userId){
        if(!userId){
            throw new Error("Missing user id.");
        }
        try{
            return await this.#db.query(
                "SELECT id, email, first_name, last_name FROM users WHERE id = $1",
                [userId]
            );
        }catch(err){
            throw new Error(err.message);
        }
    }

    async deleteUser(userId){
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