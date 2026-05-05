import JobService from "../service/job.service.js";

class JobControllers{

    async getAllCompletedJobs(req, res) {
        const user = req.user;
        try {
            const data = await JobService.allCompletedJobs(user.payload.id);
            console.log("Completed Jobs Controller",data);
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
            console.log("Unpaid Jobs Controller:", data);
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
            console.log("Active Jobs Controller",data);
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
            const data = await JobService.fetchMonthlyTotal(user.payload.id)
            console.log("Monthly Total Controller",data);
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
