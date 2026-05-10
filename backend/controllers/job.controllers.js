import JobService from "../service/job.service.js";

class JobControllers{

    async allJobData(req,res){
        const user = req.user;    
        try{
            const [
                completedJobs,
                unpaidJobs,
                activeJobs,
                monthlyTotal 
            ] = await Promise.all([
                JobService.allCompletedJobs(user.payload.id),
                JobService.allUnpaidJobs(user.payload.id),
                JobService.allActiveJobs(user.payload.id),
                JobService.getMonthlyTotal(user.payload.id)
            ]);
            return res.status(200).json({
                completedJobs,
                unpaidJobs,
                activeJobs,
                monthlyTotal
            })
        }catch(err){
            return res.status(500).json({ error: err.message });
        }
    }

    async getAllCompletedJobs(req, res) {
        const user = req.user;
        try {
            const data = await JobService.allCompletedJobs(user.payload.id);
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

    async getUnpaidJobs(req,res){
        const user = req.user;
        try{
            const data = await JobService.allUnpaidJobs(user.payload.id);  
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

    async getActiveJobs(req,res){
        const user = req.user;
        try{
            const data = await JobService.allActiveJobs(user.payload.id);
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

    async getMonthlyTotal(req,res){
        const user = req.user
        try{
            const data = await JobService.getMonthlyTotal(user.payload.id)
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
}

export default new JobControllers();
