import { getUser } from '../utils/getUser.js';
import { supabase } from '../config/supabase.config.js';

export async function requireAuth(req,res,next){
    const token = req.cookies.access_token;
    if(!token){
         return res.status(401).json({
            success: false,
            error: 'Invalid Session Token'
        })
    }
    try{
        const user = await getUser(token);
        req.user = user;
        next();
    }catch(error){
        console.error(error.message);
        return res.status(401).json({
            success: false,
            error: 'Invalid Session Token'
        })
    }
}


export async function refreshUserToken(req,res,next){
    const refreshToken = req.cookies.refresh_token;
    const accessToken = req.cookies.access_token;

    if(!accessToken && !refreshToken) return next();

    try{
        const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
        })

        if(error || !data.session){
            res.clearCookie('access_token')
            res.clearCookie('refresh_token')
            return next()
        }

        res.cookie('access_token', data.session.access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 
        })
        res.cookie('refresh_token', data.session.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 90 * 24 * 60 * 60 * 1000
        })

        next();
    }catch(error){
        res.clearCookie('access_token')
        res.clearCookie('refresh_token')
        next()
    }
}