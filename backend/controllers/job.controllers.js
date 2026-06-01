import { allCompletedJobs, allUnpaidJobs, allActiveJobs, getMonthlyTotal } from "../service/job.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../error/error.handler.js";

export const allJobData = catchAsync(async(req,res) => {
    const user = req.user;
    if(!user) throw new AppError("User not found.", 404);

	const [
        completedJobs,
        unpaidJobs,
        activeJobs,
        monthlyTotal 
    ] = await Promise.all([
        allCompletedJobs(user),
        allUnpaidJobs(user),
        allActiveJobs(user),
        getMonthlyTotal(user)
    ]);
            
    return res.status(200).json({
        completedJobs,
        unpaidJobs,
        activeJobs,
        monthlyTotal
    });
});


