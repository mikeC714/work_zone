import { decode } from "jsonwebtoken";
import Auth from "../auth/auth.js";
import TokenService from "../service/db/token.service.js";
import UserService from "../service/db/user.service.js";
import { Mutex } from "async-mutex";
import { decrypt, encrypt } from "../utils/encrypt.js";



class AuthMiddleware{

    #mutex = new Mutex();
    static #mutexMap = new Map();

    verifyToken = async(req, res, next) => {
        const token = req.cookies.access_token;
        const refreshToken = req.cookies.refresh_token;
        
        
        if(!token && !refreshToken){
            return res.status(401).json({ 
                error: "Unauthorized user. Failed to provide token." 
            })
        }
        
        if(!token && refreshToken){
            try{
                await this.#handleRefresh(req, res, next, refreshToken);
                return;
            }catch(err){
                return res.status(500).json({ error: err.message })
            }
        }
        
        try{
            const decrypted = decrypt(refreshToken);
            const decoded = Auth.verify(token);
            req.user = decoded;
            next();
        }catch(err){
             if(err.name === "TokenExpiredError" && refreshToken) {
            return this.#handleRefresh(req, res, next, decrypted);
        }
        return res.status(401).json({ error: err.message });
        }
    }

    
    #handleRefresh = async(req, res, next, token) => {
        const currRefresh = req.cookies.refresh_token;

     //Query the db based using user.id the get the currently stored refresh token.
        //   Verify the token
        //   Next pass that curr token to deleteRefresh to rotate token
        //   Followed by storing the new refresh token after hashing it
        //   Lastly assign the newly generated tokens via cookie
        
        const refreshToken = decrypt(token);
        const decoded = Auth.verifyRefresh(refreshToken);
        if(!decoded){
            throw new Error("Invalid refresh token.");
        }
        const release = await AuthMiddleware.getMutex(decoded.payload.id).acquire();

        try{
            // Refresh tokens are stored encrypted
            const storedToken = await TokenService.getRefreshToken(decoded.payload.id);
             if(!storedToken){
                return res.status(401).json({ message: "Unauthorized. User failed to provided a valid token." });
            }
            const decryptedStored = decrypt(storedToken.rows[0].token);

            // Validate the tokens match
            // If not end user session and flag their acc
            if(decryptedStored !== refreshToken){
                await TokenService.deleteRefreshToken(decoded.payload.id, storedToken);
                await UserService.flagUser(decoded.payload.id);
                res.clearCookie("access_token");
                res.clearCookie("refresh_token");
                return res.status(401).json({ message: "User is unauthorized." });
            }

            // TEST

            if(currRefresh !== refreshToken){
                const newDecoded = Auth.verifyRefresh(decrypt(currentEncryptedToken));
                req.user = newDecoded;
                return next();
            }

            // Once verified rotate token; Delete old token to then generate new token
            const deleted = await TokenService.deleteRefreshToken(decoded.payload.id, storedToken);
            
            // new tokens are then signed
            const newToken = Auth.sign({ id: decoded.payload.id });
            const newRefreshToken = Auth.signRefresh({ id: decoded.payload.id });

            const encryptedRefresh = encrypt(newRefreshToken);

            // Store new refresh token. Successfully rotating the refresh tokens.
            await TokenService.storeRefreshToken(decoded.payload.id, encryptedRefresh);            
            
            res.cookie("access_token", newToken,{
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 900000 // 15M
            });
            res.cookie("refresh_token", encryptedRefresh, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 604800000 // 7D
            });
            req.user = decoded;
            next();
        }catch(err){
            // console.log('FULL ERROR:', err);
            // console.log('STACK:', err.stack);
            // res.redirect("/auth");
            return res.status(500).json({ error: err.message });
        }finally{
            console.log("RELEASE")
            release();
            AuthMiddleware.#mutexMap.delete(decoded.payload.id)
        }
    }


    static getMutex(userId){
        if(!userId){
            throw new Error("Failed to provide user ID.");
        }
        if(!AuthMiddleware.#mutexMap.has(userId)){
            AuthMiddleware.#mutexMap.set(userId, new Mutex());
        }
        console.log(AuthMiddleware.#mutexMap.length);
        return AuthMiddleware.#mutexMap.get(userId)

    }
}





export default new AuthMiddleware();