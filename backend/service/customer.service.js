import crypto from 'node:crypto';
import { getQuoteInfo, getJobInfo } from '../utils/getQuote.js';
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

export async function createQuote(user, customer, labor, materials, quote, createdAt){
    
    const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert({
            id:crypto.randomUUID(),
            user_id: user.id,
            name: customer.name, phone: customer.phone,
            email: customer.email, address: customer.address,
            created_at: createdAt
        })
        .single()

        if(customerError){
            console.error('Failed to insert Customer Data')
            return { error: customerError }
        }

    const [
        { data: laborData, error: laborError },
        { data: materialsData, error: materialsError },
    ] = await Promise.all([

        supabase.from('labor').insert(
            labor.map(work => ({
                id: crypto.randomUUID(),
                user_id: user.id,
                quote_id: quote.id, 
                description: work.description,
                hours: work.hours,
                hourly_rate: work.hourly,
                created_at: createdAt
            }))
        ),

        supabase.from('materials').insert(
            materials.map(material => ({
                id: crypto.randomUUID(),
                user_id: user.id,
                quote_id: quote.id,
                description: material.description,
                quantity: material.quantity,
                unit_metric: material.metric,
                unit_cost: material.unitCost,
                created_at: createdAt
            }))
        ),
    ]);

    if(laborError || materialsError) {
        const error = laborError || materialsError;
        console.error(`Failed to insert labor/materials: ${error.message}`);
        return { error };
    }

    const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .insert({
            id: crypto.randomUUID(),
            user_id: user.id,
            customer_id: customerData.id,
            token: crypto.randomUUID(),
            status: quote.status,
            markup: quote.markup,   
            total: quote.total,
            created_at: createdAt
        })
        .select()
        .single()
    
    if(quoteError){
        console.error('Failed to insert Quote Data');
        return { error: quoteError }
    }

    return { customerData, laborData, materialsData, quoteData };
}


export async function deleteQuote(quoteId, userId){
    const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('quote_id', quoteId)
        .eq('user_id', userId)

    if(error){
        console.error(`Failed to Delete Quote ${quoteId}`);
        return; 
    }

    return { success: true };
}

