import Auth from "../auth/auth.js";
import TokenService from "../service/db/token.service.js";
import UserService from "../service/db/user.service.js";
import { lock } from "../config/redlock.config.js";
import { decrypt, encrypt } from "../utils/encrypt.js";



class AuthMiddleware{
    async verifyToken (req, res, next){
        const accessToken = req.cookies.access_token;
        const refreshToken = req.cookies.refresh_token;

        if(!accessToken && !refreshToken){
            return res.status(401).json({ error: "Unauthorized user. Failed to provide valid token." });
        }

        if(!accessToken && refreshToken){
            try{
                return await this.handleRefresh();
            }catch(err){
                return res.status(500).json({ error: err.message });
            }
        }

        try{
            const valid = Auth.verify(accessToken);
            if(!valid){
                return res.status(401).json({ error: "Failed to provide valid token." });
            }
            req.user = valid.payload.id;
            next();
        }catch(err){
             if(err.name === "TokenExpiredError" && refreshToken){
                return await this.handleRefresh(req, res, next, refreshToken);
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

        const id = valid.payload.id;
        
        let rotated = false;
        await lock.using([`lock:${id}`], 4000, async(signal) => {
            try{
                if(signal.aborted) throw signal.error;

                const storedToken = await TokenService.getRefreshToken(id);
                if(!storedToken.rows.length){
                    return res.status(401).json({ error: "Unauthorized user. Failed to provide stored token." });
                }
                
                if(rotated === true){
                    return storedToken.rows[0].token;
                }

                const decryptedStored = decrypt(storedToken.rows[0].token);

                // IF TOKEN DOESN'T MATCH FLAG USER POSSIBLE
                // REUSE ABUSE 

                if(decryptedStored !== rToken){
                    const validStored = Auth.verifyRefresh(decryptedStored);
                    if(validStored.payload.id === valid.payload.id){
                        req.user = id;
                        return decryptedStored;
                    }
                    await TokenService.deleteRefreshToken(id, storedToken.rows[0].token);
                    await UserService.flagUser(id);
                    res.clearCookie("access_token");
                    res.clearCookie("refresh_token");
                    return res.status(401).json({ error: "Unauthorized. Token provided was not valid." });
                }
                await TokenService.deleteRefreshToken(id, storedToken.rows[0].token);

                const newAccess = Auth.sign({ id });
                const newRefresh = Auth.signRefresh({ id });
                const encrypted = encrypt(newRefresh);

                await TokenService.storeRefreshToken(id, encrypted);
            
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
                return req.user = id;
            }catch(err){
                return res.status(500).json({ error: err.message });
            }
        })
    }
}





export default new AuthMiddleware();