import { supabase } from '../config/supabase.config.js';

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
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

        const { data, error } = await supabase
            .from('quotes')
            .select('status')
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .gte('created_at', startOfMonth)
            .lte('created_at', endOfMonth)
            
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
        const { data, error } = await supabase
            .from('quotes')
            .select('status')
            .eq('user_id', user.id)
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
        const { data, error } = await supabase
            .from('quotes')
            .select('status')
            .eq('user_id', user.id)
            .eq('status', 'approved')

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
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

        const { data, error } = await supabase 
            .from('quotes')
            .select('total')
            .eq('user_id', user.id)
            .gte('created_at', startOfMonth)
            .lte('created_at', endOfMonth)
        
        if(error){
            return res.status(400).json({
                success: false,
                error: error.message
            })
        }

        const monthTotal = data.reduce((acc, curr) => acc + curr.total , 0)

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
