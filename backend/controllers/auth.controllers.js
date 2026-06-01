import Auth from "../auth/auth.js";
import { getUser, storeNewUser, validatePassword, getUserById, deleteUser } from "../service/db/user.service.js";
import { storeRefreshToken, deleteRefreshToken, } from "../service/db/token.service.js";
import { decrypt } from "../utils/encrypt.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError, AuthenticationError } from "../error/error.handler.js";
import bcrypt from "bcrypt";

    export const login = catchAsync(async (req, res) => {
        const { email, password } = req.body;
        if(!email || !password){
            throw new AppError("Invalid, Missing fields.", 400);
        }
        
            const user = await getUser(email);
            if(!user) throw new AppError("Invalid credentials.");

            const valid = await bcrypt.compare(password, user.password);
            if(!valid) throw new AuthenticationError("Invalid credentials.");

            const token = Auth.sign({ id: user.id });
            const refreshToken = Auth.signRefresh({ id: user.id });

            await storeRefreshToken(user.id , refreshToken);

            res.cookie("access_token", token,{
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 900000 // 15M
            })
            res.cookie("refresh_token", encryptedRefresh, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 604800000 // 7D
            })

            return res.status(200).json({ 
                user: {
                    firstName: user.first_name,
                    lastName: user.last_name
                }
			});
	});

    export const signup = catchAsync(async (req, res) => {
        const { email, firstName, lastName, password } = req.body;
        if(!firstName || !lastName || !email || !password) throw new AppError("Missing Field. Please try again", 400);
            
		const rounds = 16
        const salt = await bcrypt.genSalt(rounds);
        const safePass = await bcrypt.hash(password, salt);

        const user = await storeNewUser(firstName, lastName, email, safePass);
		if(!user) throw new AppError("Invalid Credentials.", 401);

        const token = Auth.sign({id: user.id });
        const refreshToken = Auth.signRefresh({id: user.id});

        await storeRefreshToken(user.id, refreshToken);

        res.cookie("access_token", token,{
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 900000 // 15M
        })
        res.cookie("refresh_token", encryptedRefresh, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 604800000 // 7D
        })

        return res.status(201).json({
            user:{
                firstName: user.first_name,
                lastName: user.last_name
            }
        });
	});
    
    export const logout = catchAsync(async (req, res) => {
        const refresh = req.cookies.refresh_token;
        if(!refresh) throw new AuthenticationError("Failed to provide valid token.");
		
		const decryptedRefresh = decrypt(refresh);
        
		const verified = Auth.verifyRefresh(decryptedRefresh);
		if(!verified) throw new AuthenticationError("Failed to provide valid token.");	

		const decode = Auth.decode(decryptedRefresh);

    	await deleteRefreshToken(decode.payload.id, refresh);

        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

        return res.status(200).json({ success: true });
    });


    export const deleteUser = catchAsync(async(req, res) => {
        const { password } = req.body;
        if(!password) throw new AppError("Missing field. Please try again.", 400);
        
		const refresh = req.cookies.refresh_token;
        if(!refresh) throw new AuthenticationError("Failed to provide valid token.");
            
		const decryptedRefresh = decrypt(refresh);
        const verified = Auth.verifyRefresh(decryptedRefresh);
		if(!verified) throw new AuthenticationError("Failed to provide valid token.");

		const decode = Auth.decode(decryptedRefresh);

        const valid = await validatePassword(decode.payload.id, password);
        if(!valid) throw new AppError("Invalid credentials. Please try again.", 401);

        await deleteUser(decode.payload.id, refresh);
            
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

         return res.status(200).json({ message: "User deleted" });
    });

	export const currUser = catchAsync(async(req,res) => {
        const id = req.user;
        if(!id) throw new AppError("Failed to provide user id.", 400);
        const user = await getUserById(id);
        if(!user){
        	throw new AppError("User not found.", 404);		
		}

        return res.status(200).json({ user });
	});



