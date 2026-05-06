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
            return this.#handleRefresh(req, res, refreshToken);
        }

        try{
            const decoded = Auth.verify(token);
            req.user = decoded;
            next();
        }catch(err){
             if(err.name === "TokenExpiredError" && refreshToken) {
            return this.#handleRefresh(req, res, next, refreshToken);
        }
        return res.status(401).json({ message: "Unauthorized." });
        }
    }

    #handleRefresh = async(req, res, next, refreshToken) => {
     //Query the db based using user.id the get the currently stored refresh token.
        //   Verify the token
        //   Next pass that curr token to deleteRefresh to rotate token
        //   Followed by storing the new refresh token after hashing it
        //   Lastly assign the newly generated tokens via cookie
        try{
            const decryptedToken = await decrypt(refreshToken)
            const decoded = Auth.verifyRefresh(decryptedToken);
            // Refresh tokens are stored encrypted
            const storedToken = await TokenService.getRefreshToken(decoded.payload.id); 
             if(!storedToken){
                return res.status(401).json({ message: "Unauthorized." });
            }
            const decryptedStored = await decrypt(storedToken);

            console.log("Stored Token:", decryptedStored); // DELETE THIS LATER
            // Validate the tokens match
            if(decryptedStored !== decryptedToken){
                await TokenService.deleteRefreshToken(decoded.payload.id, storedToken);
                await UserService.flagUser(decoded.payload.id);
                res.clearCookie("access_token");
                res.clearCookie("refresh_token");
                return res.status(401).json({ message: "User is unauthorized." });
            }
            // Once verified rotate token; Delete old token to then generate new token
            await TokenService.deleteRefreshToken(decoded.payload.id ,storedToken);
            // new tokens are then signed
            const newToken = Auth.sign({ id: decoded.payload.id });
            const newRefreshToken = Auth.signRefresh({ id: decoded.payload.id });
            const encryptedRefresh = await encrypt(newRefreshToken);
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
        }catch{
            return res.status(401).json({ message: "Unauthorized." });
            // res.redirect("/auth");
        }
    }
}





export default new AuthMiddleware();