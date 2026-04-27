import Auth from "../auth/auth.js";
import TokenService from "../service/db/token.service.js";
import { decrypt } from "../utils/encrypt.js";

class AuthMiddleware{
    async verifyToken(req, res, next){
        const token = req.cookies.token;
        const refreshToken = req.cookies.refresh_token;

        if(!token && !refreshToken){
            return res.status(401).json({
                message: "Unauthorized."
            })
        }

        try{
            const decoded = Auth.verify(token);
            req.user = decoded;
            next();
        }catch(err){
            if(err.name === "TokenExpiredError" && refreshToken){

                // # Query the db based using user.id the get the currently stored refresh token.
                //   Verify the token
                //   Next pass that curr token to deleteRefresh to rotate token
                //   Followed by storing the new refresh token after hashing it
                //   Lastly assign the newly generated tokens via cookie

                const storedToken = await TokenService.getRefreshToken(req.user.id); // Since this token will be encrypted it will need to be decrypted in order to get it's content
                if(!storedToken){
                    return res.status(401).json({ message: "Unauthorized." });
                }

                try{
                    const decrypted = await decrypt(refreshToken);
                    const decoded = Auth.verifyRefresh(decrypted);

                    const newToken = Auth.sign({ id: decoded.id });
                    const newRefreshToken = Auth.signRefresh({ id: decoded.id });

                    await TokenService.deleteRefreshToken(decoded.id ,storedToken);

                    // hash the token before storing
                    await TokenService.storeRefreshToken(decoded.id, newRefreshToken);

                    res.cookie("token", newToken,{
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                        maxAge: 900000 // 15M
                    });
                    res.cookie("refresh_token", newRefreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict",
                        maxAge: 604800000 // 7D
                    });

                    req.user = decoded;
                    next();
                }catch{
                    return res.status(400).json({ message: "Unauthorized" })
                }
            }

            return res.status(403).json({
                message: "Unauthorized."
            })
        }
    }
}

export default new AuthMiddleware();