import { getQuoteInfo, getJobInfo } from '../utils/getQuote.js'
import { supabase } from '../config/supabase.config.js';

export async function customerInfo(customerId){
    const { data: customerInfo, error } = await supabase
        .from('customers')
        .select('name, phone, email, address, created_at')
        .eq('id', customerId.id)
    
    if(error){
        throw new Error(`Failed to query Customer Info ${error.message}`);
    }

    console.log(data);

    return customerInfo;
}

export async function customerQuoteInfo(customerId, user){
    const quotes = await getQuoteInfo(customerId, user);

    if(!quotes || quotes.length === 0){
        return {
            quotes: [], jobs: []
        }
    }

    const quotedJobs = await Promise.all(
        quotes.map(async quote => {
            const jobInfo = await getJobInfo(quote);
            return {
                ...quote,
                job: jobInfo
            }
        })
    )

    console.log(quotedJobs);
    return quotedJobs
}

export async function customerStatus(customer, user){
    const quotes = await getQuoteInfo(customer, user);

    if(!quotes || quotes.length === 0){
        return {
            quotes: [], status: null
        }
    }

    const approvedStatus = quotes.filter(quote => quote.status === 'approved');
    const pendingStatus = quotes.filter(quote => quote.status === 'pending');
    const completedStatus = quotes.filter(quote => quote.status === 'completed');
    const declinedStatus = quotes.filter(quote => quote.status === 'declined');

    console.log({
        approvedStatus,
        pendingStatus,
        completedStatus,
        declinedStatus
    })

    return {
        approvedStatus,
        pendingStatus,
        completedStatus,
        declinedStatus
    }
}