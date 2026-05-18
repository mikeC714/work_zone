import { encrypt } from "../../utils/encrypt.js";
import bcrypt from "bcrypt";
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
                "SELECT id, first_name, last_name, email, created_at FROM users WHERE id = $1",
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
            const user = await this.#db.query(
                `SELECT id FROM users WHERE id = $1`
                ,[userId]
            );
            if(user.rows.length === 0){
                throw new Error("Invalid user.");
            }
            await this.#db.query(
                `DELETE FROM users WHERE id = $1`,
                [user.rows[0].id]
            );
        }catch(err){
            throw new Error(err.message);
        }
    }

    async flagUser(userId){
        if(!userId){
            throw new Error("Failed to terminate session. User id was not provided");
        }
        try{
            await this.#db.query(
                "UPDATE users SET is_flagged = $1 WHERE id = $2",
                [true, userId]
            )
        }catch(err){
            throw new Error(err.message);
        }/*finally{
           SET UP MESSAGING ONCE FLAG USER IS TRIGGERED SEND EMAIL TO USER ABOUT ACCOUNT BEING FLAGGED 
           FOR SUSPICIOUS ACITVITY 
        }*/
    }

    async validatePassword(userId, password){
        if(!userId){
            throw new Error("Invalid user.");
        }
        if(!password){
            throw new Error("Failed to provide a valid password.");
        }
        try{
            const pass = await this.#db.query(
                `SELECT password FROM users WHERE id = $1`,
                [userId]
            );
            if(pass.rows.length ===  0){
                throw new Error("Invalid user");
            }

            const valid = await bcrypt.compare(password, pass.rows[0].password);
            if(!valid){
                throw new Error("Invalid credentials. Failed to provide a valid password.");
            }

            return true
        }catch(err){
            throw new Error(err.message);
        }
    }
    
}

export default new UserService(db);