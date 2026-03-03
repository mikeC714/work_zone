import { supabase } from '../config/supabase.config.js';

export class AuthService {

    async signUp(email, password, username){
        if(!email || !password || !username){
            throw new Error('Invaild feilds. Please fill feilds')
        }
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: [
                username
            ]
        })

        if(error){
            throw new Error(error.message);
        }
        
        return data;
    }

    async login(email, password){
        if(!email || !password){
            throw new Error('Invaild User. Please try again')
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
         
        if(error){
            throw new Error(` Failed to login user: ${error.message}`);
        }

        return data;
    }

    async logout(){
        const { error } = await supabase.auth.signOut();

        if(error){
            throw new Error(`Failed to Logout user ${error.message}`);
        }
    }

    async existingUser(email){
        const { data } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .maybeSingle()
        
        return !!data
    }
}