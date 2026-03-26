import { AuthService } from '../service/auth.service.js';
import { supAuth } from '../config/supabase.config.js';

const auth = new AuthService(supAuth);

export async function signUp(req,res){
    let { firstName, lastName, email, password  } = req.body;

    email = email?.trim().toLowerCase();   

    if(!firstName || !lastName || !email || !password){
        console.error('Invalid field')
        return res.status(400).json({
        success: false,
        error: `Invalid fields. Please try again`
       })
    }
    try{
        const userExists = await auth.existingUser(email)

        if(userExists){
            return res.status(409).json({
                success: false,
                error: `Account with email ${email} already exists`
            })
        }
        const { session, user } = await auth.signUp(firstName, lastName, email, password);
        
        res.cookie('access_token', session.access_token,{
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 
        });
        res.cookie('refresh_token', session.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 90 * 24 * 60 * 60 * 1000
        })

        console.log({
            success: true,
            user
         })
        return res.status(201).json({
            success: true,
            user
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export async function login(req,res){
    const { email, password } = req.body;

    if(!email || !password){

        return res.status(400).json({
            success: false,
            error: `Invaild feilds. Please try again`
        })
    }
    try{
        const { session, user } = await auth.login(email, password);

         res.cookie('access_token', session.access_token,{
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 
        });
        res.cookie('refresh_token', session.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 90 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({
            success: true,
            user
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export async function logOut(req,res){
    try{
        await auth.logout()

        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        return res.status(200).json({
            success: true,
            message: 'Logging out was successful'
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}