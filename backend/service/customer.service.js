import crypto from 'node:crypto';
import { getQuoteInfo, getJobInfo } from '../utils/getQuote.js';

export class CustomerService{
    constructor(supabase){
        this.supabase = supabase
    }

        async customerInfo(customerId, user){

        const customerIds = customerId.map(customer => customer.id)

        const { data: customerInfo, error } = await this.supabase
            .from('customers')
            .select('id, name, phone, email, address, created_at')
            .eq('user_id', user.id)
            .in('id', customerIds)
        
        if(error){
            throw new Error(`Failed to query Customer Info ${error.message}`);
        }

        console.log(customerInfo);

        return customerInfo;
    }

    async customerQuoteInfo(customerIds, user){
        const quotes = await getQuoteInfo([customerIds], user);

        if(!quotes || quotes.length === 0){
            return {
                quotes: [], jobs: []
            }
        }

        const quotedJobs = await Promise.all(
            quotes.map(async quote => {
                const jobInfo = await getJobInfo([quote]);
                return {
                    ...quote,
                    job: jobInfo
                }
            })
        )

        console.log(quotedJobs);
        return quotedJobs
    }

    async customerStatus(customer, user){
        const quotes = await getQuoteInfo([customer], user);

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

    async createQuote(user, customer, quote, labor, materials, createdAt){
        
        const { data: customerData, error: customerError } = await this.supabase
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

            const { data: quoteData, error: quoteError } = await this.supabase
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

        const [
            { data: laborData, error: laborError },
            { data: materialsData, error: materialsError },
        ] = await Promise.all([

            this.supabase
            .from('labor')
            .insert(
                labor.map(work => ({
                    id: crypto.randomUUID(),
                    user_id: user.id,
                    quote_id: quoteData.id, 
                    description: work.description,
                    hours: work.hours,
                    hourly_rate: work.hourlyRate,
                    total: work.total,
                    created_at: createdAt
                }))
            ),

            this.supabase
            .from('materials')
            .insert(
                materials.map(mats => ({
                    id: crypto.randomUUID(),
                    user_id: user.id,
                    quote_id: quoteData.id,
                    description: mats.description,
                    quantity: mats.quantity,
                    unit_metric: mats.metric,
                    unit_cost: mats.unitCost,
                    created_at: createdAt
                }))
            ),
        ]);

        if(laborError || materialsError) {
            const error = laborError || materialsError;
            console.error(`Failed to insert labor/materials: ${error.message}`);
            return { error };
        }

        return { customerData, quoteData, laborData, materialsData };
    }


    async deleteQuote(quoteId, userId){
        const { error } = await this.supabase
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
}



