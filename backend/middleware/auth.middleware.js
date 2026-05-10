import { decode } from "jsonwebtoken";
import Auth from "../auth/auth.js";
import TokenService from "../service/db/token.service.js";
import UserService from "../service/db/user.service.js";
import { decrypt, encrypt } from "../utils/encrypt.js";


class AuthMiddleware{
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
                const decrypted = decrypt(refreshToken);
                await this.#handleRefresh(req, res, next, decrypted);
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

    #handleRefresh = async(req, res, next, refreshToken) => {
     //Query the db based using user.id the get the currently stored refresh token.
        //   Verify the token
        //   Next pass that curr token to deleteRefresh to rotate token
        //   Followed by storing the new refresh token after hashing it
        //   Lastly assign the newly generated tokens via cookie
        try{
            const decoded = Auth.verifyRefresh(refreshToken);
            console.log("1) DECODED:", decoded);
            // Refresh tokens are stored encrypted
            const storedToken = await TokenService.getRefreshToken(decoded.payload.id);
            console.log("2) GETTING STORED TOKEN:", storedToken); 
             if(!storedToken){
                return res.status(401).json({ message: "Unauthorized. User failed to provided a valid token." });
            }
            const decryptedStored = decrypt(storedToken.rows[0].token);
            console.log("3) DECRYPTING STORED:", decryptedStored);

            // Validate the tokens match
            // If not end user session and flag their
            if(decryptedStored !== refreshToken){
                await TokenService.deleteRefreshToken(decoded.payload.id, storedToken);
                await UserService.flagUser(decoded.payload.id);
                res.clearCookie("access_token");
                res.clearCookie("refresh_token");
                return res.status(401).json({ message: "User is unauthorized." });
            }
            // Once verified rotate token; Delete old token to then generate new token
            /* TESTING CURRENTLY BELIEVE RUNNING INTO RACE CONDITION WITH WHAT I BELIEVE TO BE 
                FROM REQUESTS COMING IN WHILE ATTEMPTING TO DELETE TOKEN
                SO A CLAUSE WAS PUT IN PLACE VALIDATING IF THERE WERE ANY DELETED DATA
                                        |
                                        V
            */
            const deleted = await TokenService.deleteRefreshToken(decoded.payload.id ,storedToken);
            console.log("4) DELETING OLD TOKEN:", deleted.data);

            if(!deleted.data){
                console.log("5) LOSER BRANCH:", deleted.data);
                const activeRefresh = await TokenService.getRefreshToken(decoded.payload.id);
                const newAccess = Auth.sign({ id: decoded.payload.id });

                res.cookie("access_token", newAccess, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 900000
                })
                res.cookie("refresh_token", activeRefresh.rows[0].token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 604800000
                })

                req.user = decoded;
                return next();
            };

            // new tokens are then signed
            const newToken = Auth.sign({ id: decoded.payload.id });
            const newRefreshToken = Auth.signRefresh({ id: decoded.payload.id });
            console.log(`6) GENERATE NEW TOKENS:   ACCESS:${newToken},   REFRESH:${newRefreshToken}`)

            const encryptedRefresh = await encrypt(newRefreshToken);
            console.log("7) ENCRYPTING REFRESH TOKEN:", encryptedRefresh);
            // Store new refresh token. Successfully rotating the refresh tokens.
            const awaitingStorage = await TokenService.storeRefreshToken(decoded.payload.id, encryptedRefresh);
            console.log("8) STORING REFRESH TOKEN:", awaitingStorage);            res.cookie("access_token", newToken,{
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
        }
    }
}





export default new AuthMiddleware();