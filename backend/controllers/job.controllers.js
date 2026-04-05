import { db } from '../config/supabase.config.js';

export async function getAllCompletedJobs(req, res) {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ 
            success: false, 
            error: 'Invalid User' 
        });
    }

    try {
        const now = new Date();
        const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

        const { data, error } = await db
            .from('quotes')
            .select('status, created_at')
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .gte('created_at',startOfMonth.toISOString())
            .lt('created_at',endOfMonth.toISOString())
            
        if(error){
            return res.status(400).json({ 
                success: false, 
                error: error.message 
            });
        }

        return res.status(200).json({
             success: true, 
             data
        });

    }catch(error){
        return res.status(500).json({
             success: false, 
             error: error.message 
        });
    }
}

export async function getUnpaidJobs(req,res){
    const user = req.user;

    if(!user){
        return res.status(401).json({
            success: false,
            error: `Invalid User`
        })
    }

    try{

        const now = new Date();
        const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

        const { data, error } = await db
            .from('quotes')
            .select('status, created_at')
            .eq('user_id', user.id)
            .gte('created_at', startOfMonth.toISOString())
            .lt('created_at', endOfMonth.toISOString())
            .neq('status', 'completed')

        if(error){
            return res.status(400).json({
                success: false,
                error: error.message
            })
        }

        return res.status(200).json({
            success: true,
            data
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export async function getActiveJobs(req,res){
    const user = req.user;

    if(!user){
        return res.status(401).json({
            success: false,
            error: `Invalid User`
        })
    }
    try{

        const now = new Date();
        const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
        
        const { data, error } = await db
            .from('quotes')
            .select('status, created_at')
            .eq('user_id', user.id)
            .eq('status', 'approved')
            .gte('created_at', startOfMonth.toISOString())
            .lt('created_at', endOfMonth.toISOString())


        if(error){
            return res.status(400).json({
                success: false,
                error: error.message
            })
        }   

        return res.status(200).json({
            success: true,
            data
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export async function getMonthlyTotal(req,res){
    const user = req.user

     if(!user){
        return res.status(401).json({
            success: false,
            error: `Invalid User`
        })
    }
    try{

        const now = new Date();
        const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

        const { data, error } = await db
            .from('quotes')
            .select('total, status, created_at')
            .eq('user_id', user.id)
            .in('status', ['approved','completed'])
            .gte('created_at', startOfMonth.toISOString())
            .lt('created_at', endOfMonth.toISOString())
        
        if(error){
            return res.status(400).json({
                success: false,
                error: error.message
            })
        }

        const monthTotal = data.reduce((acc, curr) => acc + curr.total , 0).toLocaleString();

        console.log(data)
        return res.status(200).json({
            success: true,
            monthTotal
        })
            
    }catch(error){
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}
