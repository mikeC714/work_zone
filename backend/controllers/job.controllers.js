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
                JobService.allCompletedJobs(user),
                JobService.allUnpaidJobs(user),
                JobService.allActiveJobs(user),
                JobService.getMonthlyTotal(user)
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

}

export default new JobControllers();
