import jwt from "jsonwebtoken";

class Auth{
    #expiry
    #secret
    #refreshExpiry
    #refreshSecret
    #emailSecret
    #emailExpiry
    constructor(){
        this.#secret = process.env.JWT_SECRET;
        this.#expiry = process.env.JWT_EXPIRY || "5m"; 
        this.#refreshExpiry = process.env.JWT_REFRESH_EXPIRY || "1d";
        this.#refreshSecret = process.env.JWT_REFRESH_SECRET;
        this.#emailSecret = process.env.JWT_EMAIL_SECRET
        this.#emailExpiry = "2d"
    }
    
    sign = (payload) => {
        try{
            return jwt.sign({ payload: payload }, this.#secret, { expiresIn: this.#expiry });
        }catch(err){
            throw err;
        }        
    }

    signRefresh = (payload) => {
        try{
            return jwt.sign({ payload: payload }, this.#refreshSecret, { expiresIn: this.#refreshExpiry });
        }catch(err){
            throw err;
        }
    }

    signEmail = (payload) => {
        try{
            return jwt.sign({ payload: payload }, this.#emailSecret, { expiresIn: this.#emailExpiry});
        }catch(err){
            throw err;
        }
    }
        
    verifyEmail = (token) => {
        try{
            return jwt.verify(token, this.#emailSecret);
        }catch(err){
            throw err;
        }
    }

    verifyRefresh = (token) => {
        try{
            return jwt.verify(token, this.#refreshSecret);
        }catch(err){
            console.log(err.message)
            throw err;
        }
    }

    verify = (token) => {
        try{
            return jwt.verify(token, this.#secret);
        }catch(err){
            throw err;
        }
    }


    decode = (token) => {
        try{
            return jwt.decode(token);
        }catch(err){
            throw err;
        }
    }
}

export default new Auth();
