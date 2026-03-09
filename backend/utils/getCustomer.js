import { supabase } from "../config/supabase.config.js";

export async function getCustomerId(user){

    const { data: customerId, error } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single()
    
    if(error){
        throw new Error(`Failed to query customer ${error.message}`);
    }

    return customerId
}

export async function getAllCustomerIds(user){
    
    const { data: allCustomerId, error } = await supabase  
        .from('customers')
        .select('id')
        .eq('user_id', user.id)

    if(error){
        throw new Error(`Failed to query All Customers ${error.message}`)
    }

    return allCustomerId
}