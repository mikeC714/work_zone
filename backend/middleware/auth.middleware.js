import { getUser } from '../utils/getUser.js';

export async function requireAuth(req,res,next){
    const token = req.cookies.access_token;

    if(!token){
         return res.status(401).json({
            success: false,
            error: 'Invalid Session Token'
        })
    }

    console.log(token);

    try {
        const user = await getUser(token);
        req.user = user;
        next();
    }catch(error) {
        console.error(error.message);
        return res.status(401).json({
            success: false,
            error: 'Invalid Session Token'
        })
    }
}