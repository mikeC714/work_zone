import Auth from "../auth/auth.js";
import AuthMiddleware from "../middleware/auth.middleware.js";
import UserService from "../service/db/user.service.js";
import TokenService from "../service/db/token.service.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

class AuthController{
    async login(req, res){
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ message: "Login failed, missing input field." });
        }
        
        try{
            const res = await UserService.getUser(email);
            const user = res.rows[0];
            if(!user){
                return res.status(401).json({ message: "Invalid credentials." });
            }

            const valid = await bcyrpt.compare(password, user.password);
            if(!valid){
                return res.status(401).json({ message: "Invalid Credentials." });
            }

            const token = Auth.sign({ id: user.id });
            const refreshToken = Auth.signRefresh({ id: user.id });

            await TokenService.storeRefreshToken(user.id ,refreshToken);

            res.cookie("access_token", token,{
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 900000 // 15M
            })
            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 604800000 // 7D
            })

            return res.status(200).json({ message: `${user.email}, successfully logged in.` });

        }catch(err){
            console.error(err.message);
            return res.status(500).json({
                message: "Failed to login.",
                error: err.message
            })
        }
    }

    async signup(req, res){
        const { username, email, password } = req.body;
        if(!username || !email || !password){
            return res.status(400).json({ message: "Missing field input." });
        }

        try{
            const salt = await bcrypt.genSalt(process.env.SALT);
            const safePass = await bcrypt.hash(password, salt);

            const user = await UserService.storeNewUser(username, email, safePass);


            const token = Auth.sign({ id: user.id });
            const refreshToken = Auth.signRefresh({ id: user.id });

            await TokenService.storeRefreshToken(user.id, refreshToken);

            res.cookie("access_token", token,{
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 900000 // 15M
            })
            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 604800000 // 7D
            })

            return res.status(201).json({ message: `${user.email}, successfully created an account.` });

        }catch(err){
            console.error(err.message);
            return res.status(500).json({
                message: "Failed to sign up.",
                error: err.message
            })
        }
    }
    
    async logout(req, res){
        const refresh = req.cookie.refresh_token;
        if(!refresh){
            return res.status(401).json({ message: "User is unauthorized." });
        }
        try{
            const decoded = Auth.verifyRefresh(refresh);
            if(!decoded){
                return res.status(401).json({
                    message: "User unauthorized due to invalid token."
                });
            }
            await TokenService.deleteRefresh(decoded.id, refresh);

            res.clearCookie("access_token");
            res.clearCookie("refresh_token");

            return res.status(200).json({ message: `${decoded.id} has successfully logged out.` });

        }catch(err){
            return res.status(500).json({
                message: "Failed to logout.",
                error: err.message
            })
        }
    }

    async deleteUser(req, res){
        const refresh = req.cookie.refresh_token;
        if(!refresh){
            return res.status(401).json({ message: "User is unauthorized." })
        }
        try{
            const decoded = Auth.verifyRefresh(refresh);
            if(!decoded){
                return res.status(401).json({ message: "User unauthorized do to invalid token." });
            }
            
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");

            await UserService.deleteUser(decoded.id);

            return res.status(200).json({ message: "Account successfully deleted." });

        }catch(err){
            return res.status(500).json({ 
                message: "Failed to delete user.",
                error: err.message
             })
        }
    }
}

export default new AuthController();