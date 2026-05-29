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

    * Called by verifyToken if access_token is expired but refresh_token is active
    * Token is decrypted and validated
    * 


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
            return res.status(401).json({ error: "Failed to provide valid token." });
        }
        const decode = Auth.decode(accessToken);
        const now = Math.floor(Date.now() / 1000) // current time in seconds
        const timeRemaining = decode.exp - now // seconds left until expiry
        const grace = 10 * 60

        if(timeRemaining <= grace && refreshToken){
            try{
                return await this.handleRefresh(req, res, next);
            }catch(err){
                return res.status(500).json({ error: err.message });
            }
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
        
        try{
            await lock.using([`lock:${id}`], 3000, async(signal) => {
                if(signal.aborted) throw signal.error;

                   const alreadyRotated = await cache.get(`rotated:${id}`);
                    if(alreadyRotated){
                        console.log(alreadyRotated);
                        req.user = id;
                        return;
                    }


                const storedToken = await TokenService.getRefreshToken(id);
                if(!storedToken.rows.length){
                    return res.status(401).json({ error: "Unauthorized user. Failed to provide stored token." });
                }

                const decryptedStored = decrypt(storedToken.rows[0].token);
                const decodedStored = Auth.decode(decryptedStored);

                if(decryptedStored !== rToken){
                    await TokenService.deleteRefreshToken(id, storedToken.rows[0].token);
                    await UserService.flagUser(id);
                    res.clearCookie("access_token");
                    res.clearCookie("refresh_token");
                    throw new Error("Unauthorized. Suspicious activity has been noticed.");
                }

                await TokenService.deleteRefreshToken(id, storedToken.rows[0].token);

                const newAccess = Auth.sign({ id });
                const newRefresh = Auth.signRefresh({ id });
                const encrypted = encrypt(newRefresh);

                await TokenService.storeRefreshToken(id, encrypted);
                await cache.set(`rotated:${id}`, newAccess, 'EX', 5)

                console.log("CACHE SET");

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
                req.user = id;
            });

            next();
            }catch(err){
                return res.status(500).json({ error: err.message });
            }
    }
}





export default new AuthMiddleware();