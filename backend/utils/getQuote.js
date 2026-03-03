import { supabase } from '../config/supabase.config.js';

export async function getQuoteInfo(customerId, user){
    const { data: quoteInfo, error } = await supabase
        .from('quotes')
        .select('status, id, total, markup, job_id, created_at')
        .eq('user_id', user.id)
        .eq('customer_id', customerId.id)

    if(error){
        throw new Error(`Failed to query Quote Info ${error.message}`);
    }

    return quoteInfo;
}

export async function getJobInfo(quote){
    const { data: jobInfo, error } = await supabase
        .from('labor')
        .select('description, hours, hourly_rate')
        .eq('quote_id', quote.id)

    if(error){
        throw new Error(`Failed to query Job Info ${error.message}`);
    }

    return jobInfo;
}