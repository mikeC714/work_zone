import { supabase } from '../config/supabase.config.js';

export async function getUser(token){
    if(!token){
        throw new Error('Invalid token')
    }
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if(error){
        throw new Error(`Failed to query user ${error.message}`)
    }

    return user;
}