import express from 'express';
import { getAllCompletedJobs, getUnpaidJobs, getActiveJobs, getMonthlyTotal } from '../controllers/job.controllers.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const jobRouter = express.Router();

jobRouter.get('/completed-jobs', requireAuth, getAllCompletedJobs)
jobRouter.get('/unpaid-jobs', requireAuth, getUnpaidJobs)
jobRouter.get('/active-jobs', requireAuth, getActiveJobs)
jobRouter.get('/monthly-revenue', requireAuth, getMonthlyTotal)