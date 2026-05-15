import jwt from "jsonwebtoken";
import db from "../config/postgresql.config.js";

class Auth{
    #expiry
    #secret
    #db
    #refreshExpiry
    #refreshSecret
    #emailSecret
    #emailExpiry
    constructor(db){
        this.#db = db;
        this.#secret = process.env.JWT_SECRET;
        this.#expiry = process.env.JWT_EXPIRY || "15m"; 
        this.#refreshExpiry = process.env.JWT_REFRESH_EXPIRY || "1d";
        this.#refreshSecret = process.env.JWT_REFRESH_SECRET;
        this.#emailSecret = process.env.EMAIL_TOKEN
        this.#emailExpiry = "2d"
    }
    
    sign(payload){
        try{
            console.log(this.#expiry)
            return jwt.sign({ payload: payload }, this.#secret, { expiresIn: this.#expiry });
        }catch(err){
            throw err;
        }        
    }

    signRefresh(payload){
        try{
            return jwt.sign({ payload: payload }, this.#refreshSecret, { expiresIn: this.#refreshExpiry });
        }catch(err){
            throw err;
        }
    }

    signEmail(payload){
        try{
            return jwt.sign({ payload: payload }, this.#emailSecret, { expiresIn: this.#emailExpiry});
        }catch(err){
            throw err;
        }
    }
        
    verifyEmail(token){
        try{
            return jwt.verify(token, this.#emailSecret);
        }catch(err){
            throw err;
        }
    }

    verifyRefresh(token){
        try{
            return jwt.verify(token, this.#refreshSecret);
        }catch(err){
            throw err;
        }
    }

    verify(token){
        try{
            return jwt.verify(token, this.#secret);
        }catch(err){
            throw err;
        }
    }

    decode(token){
        try{
            return jwt.decode(token);
        }catch(err){
            throw err;
        }
    }
}

export default new Auth(db);