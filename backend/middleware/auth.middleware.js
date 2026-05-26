import Auth from "../auth/auth.js";
import TokenService from "../service/db/token.service.js";
import UserService from "../service/db/user.service.js";
import { Mutex } from "async-mutex";
import { decrypt, encrypt } from "../utils/encrypt.js";



class AuthMiddleware{

    #mutex = new Mutex();
    static #mutexMap = new Map();

    verifyToken = async (req, res, next) => {
        const accessToken = req.cookies.access_token;
        const refreshToken = req.cookies.refresh_token;

        if(!accessToken && !refreshToken){
            return res.status(401).json({ error: "Unauthorized user. Failed to provide valid token." });
        }

        if(!accessToken && refreshToken){
            try{
                return await this.handleRefresh(req, res, next, refreshToken);
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
            return next();
        }catch(err){
             if(err.name === "TokenExpiredError" && refreshToken){
                return await this.handleRefresh(req, res, next, refreshToken);
            }   
            return res.status(500).json({ error: err.message });
        }
    }
    
    handleRefresh = async (req, res, next, token) => {
        if(!token){
            return res.status(400).json({ error: "Failed to refresh token; was not provided token." });
        }

        const rToken = decrypt(token);
        const valid = Auth.verifyRefresh(rToken);
        if(!valid){
            return res.status(401).json({ error: "Failed to provided valid refresh token." });
        }

        const id = valid.payload.id;

        const release = await AuthMiddleware.getMutex(id).acquire();

        try{
            const storedToken = await TokenService.getRefreshToken(id);
            if(!storedToken){
                return res.status(401).json({ error: "Unauthorized user. Failed to provide stored token." });
            }
            const decryptedStored = decrypt(storedToken.rows[0].token);

            if(decryptedStored !== rToken){
                const validStored = Auth.verifyRefresh(decryptedStored);
                if(validStored.payload.id === valid.payload.id){
                    console.log("USING EXISTING TOKEN")
                    req.user = id;
                    return next();
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
            });

            res.cookie("refresh_token", encrypted, {
                httpOnly:true,
                secure: true,
                sameSite: 'strict',
                maxAge: 604800000 // 7D
            });
            
            req.user = id;
            return next();
        }catch(err){
            return res.status(500).json({ error: err.message });
        }finally{
            console.log("RELEASE")
            release();
            const mutex = AuthMiddleware.#mutexMap.get(id);
            if(mutex && mutex.isLocked()){
                AuthMiddleware.#mutexMap.delete(id);
            }
            return;
        }
    }

    static getMutex(userId){
        if(!userId){
            throw new Error("Failed to provide user ID.");
        }
        if(!AuthMiddleware.#mutexMap.has(userId)){
            AuthMiddleware.#mutexMap.set(userId, new Mutex());
        }
        return AuthMiddleware.#mutexMap.get(userId)

    }
}





export default new AuthMiddleware();