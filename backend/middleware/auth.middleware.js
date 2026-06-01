import Auth from "../auth/auth.js";
import TokenService from "../service/db/token.service.js";
import UserService from "../service/db/user.service.js";
import { lock } from "../config/redlock.config.js";
import { cache } from "../config/redis.config.js";
import { decrypt, encrypt } from "../utils/encrypt.js";


/**
    @AuthMiddleware
    
    * binds methods verifyToken n handleRefresh since (this) instance is dropped when utilizing verifyToken 
        causing handleRefresh to be undefined
    
    @verifyToken

    * Validates user is sending valid, active access token
    * If access token is invalid but their refresh is active handleRefresh is called
    * If access is valid req.user is set 

    @handleRefresh 
    ** THE BIGGEST PAIN IN THE ASS. TRULY HUMBLING THOUGH SHOWING HOW STUPID I STILL AM
    * Called by verifyToken if access_token is expired but refresh_token is active
    * Token is decrypted and validated
    * Since the main issue when rotating tokens is concurrency a lock (redlock/redis) is put into play
    * lock is initialized using the users id from token payload
    * A validation is ran based on the cached data receieved from the winner condition
    * If token is cached req.user is set to id and return is called stopping other concurrent requests attempting to rotate refresh token
    * Reuse abuse is monitored using the winner conditoins refresh token comparing the value to the currently stored token if they don't match user account is flagged and session is ended
    * Refresh token is deleted successfully rotating and generating new credentials 
    * sets winner condition with expiration of 5s


*/


class AuthMiddleware{
    constructor(){
        this.verifyToken = this.verifyToken.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    async verifyToken (req, res, next){
        const accessToken = req.cookies.access_token;
        const refreshToken = req.cookies.refresh_token;

        if(!accessToken && !refreshToken){
            return res.status(401).json({ error: "Unauthorized user. Failed to provide valid token." });
        }

        const valid = Auth.verify(accessToken);
        if(!valid){
			console.log("MADE IT TO VALID CHECKER");
			if (refreshToken) {
				console.log("GOING TO REFRESH BRANCH");
            	return await this.handleRefresh(req, res, next);
        	}
            return res.status(401).json({ error: "Failed to provide valid token." });
        }
        try{
            req.user = valid.payload.id;
            next();
        }catch(err){
             if(err.name === "TokenExpiredError" && refreshToken){
                return await this.handleRefresh(req, res, next);
            }   
            return res.status(500).json({ error: err.message });
        }
    }
    
    async handleRefresh (req, res, next){
        const refreshToken = req.cookies.refresh_token;
        console.log("REFRESH_TOKEN:", refreshToken);
		if(!refreshToken){
            return res.status(400).json({ error: "Failed to refresh token; was not provided token." });
        }

        const rToken = decrypt(refreshToken);
        const valid = Auth.verifyRefresh(rToken);
        if(!valid){
            return res.status(401).json({ error: "Failed to provided valid refresh token." });
        }
        
        const decode = Auth.decode(rToken);
        const id = decode.payload.id;

        const alreadyRotated = await cache.get(`rotated:${id}`);
            if(alreadyRotated){
				console.log("already rotated");
                req.user = id;
                return next();
            }
	
		try{
			let rotated = false;
            await lock.using([`lock:${id}`], 10000, async(signal) => {
                if(signal.aborted) throw signal.error;
					
				console.log(signal);
	
				const stillRotated = await cache.get(`rotated:${id}`);
				if(stillRotated){
					rotated = true;
					req.user = id;
					return;
				}

                const storedToken = await TokenService.getRefreshToken(id);
                if(!storedToken.rows.length){
                    res.status(401).json({ error: "Unauthorized user. Failed to provide stored token." });
    				return;            
				}
	
                const decryptedStored = decrypt(storedToken.rows[0].token);

                if(decryptedStored !== rToken){
                    await TokenService.deleteRefreshToken(id, storedToken.rows[0].token);
                    await UserService.flagUser(id);
                    res.clearCookie("access_token");
                    res.clearCookie("refresh_token");
                    res.status(401).json({message: "Unauthorized. Suspicious activity has been noticed."});
                	return;
				}

                await TokenService.deleteRefreshToken(id, storedToken.rows[0].token);

                const newAccess = Auth.sign({ id });
                const newRefresh = Auth.signRefresh({ id });
                const encrypted = encrypt(newRefresh);

                await TokenService.storeRefreshToken(id, encrypted);
                await cache.set(`rotated:${id}`, newAccess, 'EX', 5);

                res.cookie("access_token", newAccess, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 900000 // 15M
                })
                res.cookie("refresh_token", encrypted, {
                    httpOnly:true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 604800000 // 7D
                })
				rotated = true;
                req.user = id;
            });

            if(rotated) return next();
            }catch(err){
                return res.status(500).json({ error: err.message });
            }
    }
}





export default new AuthMiddleware();
