import express from 'express';
import { allJobData } from "../controllers/job.controllers.js";
import { verifyToken } from '../middleware/auth.middleware.js';


const jobRouter = express.Router();

jobRouter.use(verifyToken);

jobRouter.get("/quick-access", allJobData);

/*
    TESTING SOMETHING
   |||||||||||||||||||
   VVVVVVVVVVVVVVVVVVV
*/
// jobRouter.get('/completed-jobs', JobControllers.getAllCompletedJobs);
// jobRouter.get('/unpaid-jobs', JobControllers.getUnpaidJobs);
// jobRouter.get('/active-jobs', JobControllers.getActiveJobs);
// jobRouter.get('/monthly-revenue', JobControllers.getMonthlyTotal);


export default jobRouter;
