import { getUser } from '../utils/getUser.js';

export async function requireAuth(req,res){
    const token = req.cookies.access_token;

    if(!token){
         return res.status(401).json({
            success: false,
            error: 'Invalid Session Token'
        })
    }
    try {
        const user = await getUser(token);
        req.user = user;
    }catch(error) {
        console.error(error.message);
        return res.status(401).json({
            success: false,
            error: 'Invalid Session Token'
        })
    }
}