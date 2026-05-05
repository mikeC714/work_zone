import Auth from "../auth/auth.js";
import TokenService from "../service/db/token.service.js";
import { decrypt } from "../utils/encrypt.js";

class AuthMiddleware{
    async verifyToken(req, res, next){
        const token = req.cookies.access_token;
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

                //   Query the db based using user.id the get the currently stored refresh token.
                //   Verify the token
                //   Next pass that curr token to deleteRefresh to rotate token
                //   Followed by storing the new refresh token after hashing it
                //   Lastly assign the newly generated tokens via cookie
                try{
                    const decrypted = await decrypt(refreshToken);
                    const decoded = Auth.verifyRefresh(decrypted);

                    const storedToken = await TokenService.getRefreshToken(decoded.payload.id); // Since this token will be encrypted it will need to be decrypted in order to get it's content
                     if(!storedToken){
                        return res.status(401).json({ message: "Unauthorized." });
                    }

                    const newToken = Auth.sign({ id: decoded.payload.id });
                    const newRefreshToken = Auth.signRefresh({ id: decoded.payload.id });

                    await TokenService.deleteRefreshToken(decoded.payload.id ,storedToken);

                    // hash the token before storing
                    await TokenService.storeRefreshToken(decoded.payload.id, newRefreshToken);

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
                    return res.status(401).json({ message: "Unauthorized." });
                    // res.redirect("/auth");
                }
            }

            return res.status(401).json({ message: "Unauthorized." });
            // res.redirect("/auth");
        }
    }
}






export default new AuthMiddleware();