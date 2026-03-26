import { db } from '../config/supabase.config.js';

export async function getQuoteInfo(customerIds, user){
    const cusIds = customerIds.map(customer => customer.id)

    const { data: quoteInfo, error } = await db
        .from('quotes')
        .select('status, id, total, markup, job_id, created_at, customer_id')
        .eq('user_id', user.id)
        .in('customer_id', cusIds)

    if(error){
        throw new Error(`Failed to query Quote Info ${error.message}`);
    }

    return quoteInfo;
}

export async function getJobInfo(quote){
    const quoteIds = quote.map(quotes => quotes.id)

    const { data: jobInfo, error } = await db
        .from('labor')
        .select('description, hours, hourly_rate, quote_id')
        .in('quote_id', quoteIds)   
        
    if(error){
        throw new Error(`Failed to query Job Info ${error.message}`);
    }

    return jobInfo;
}