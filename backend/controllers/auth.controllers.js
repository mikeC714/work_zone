import { AuthService } from '../service/auth.service.js';

const auth = new AuthService;

export async function signUp(req,res){
    const { username, email, password  } = req.body;

    if(!username || !email || !password){
       return res.status(400).json({
        success: false,
        error: `Invalid feilds. Please try again`
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
        const user = await auth.signUp(email, password, username);
        
        res.status(201).json({
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
        const user = await auth.login(email, password);
        return res.status(200).json({
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