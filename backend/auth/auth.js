import jwt from "jsonwebtoken";
import db from "../config/postgresql.config.js";

class Auth{
    #expiry
    #secret
    #db
    #refreshExpiry
    #refreshSecret

    constructor(db){
        this.#db = db;
        this.#secret = process.env.JWT_SECRET;
        this.#expiry = process.env.JWT_EXPIRY || "1h"; 
        this.#refreshExpiry = process.env.JWT_REFRESH_EXPIRY || "7d";
        this.#refreshSecret = process.env.JWT_REFRESH_SECRET;
    }
    
    sign(payload){
        return jwt.sign({ payload: payload }, this.#secret, { expiresIn: this.#expiry });
    }

    signRefresh(payload){
        return jwt.sign({ payload: payload }, this.#refreshSecret, { expiresIn: this.#refreshExpiry });
    }

    verifyRefresh(token){
        return jwt.verify(token, this.#refreshSecret);
    }

    verify(token){
        return jwt.verify(token, this.#secret);
    }

    decode(token){
        return jwt.decode(token);
    }
}

export default new Auth(db);