import express from 'express';
import { getCustomerInfo, getCustomerStatus, getCustomerQuoteInfo } from '../controllers/customer.controllers.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const customerRouter = express.Router();

customerRouter.get('/customer-info', requireAuth, getCustomerInfo)
customerRouter.get('/customer-status', requireAuth, getCustomerStatus)
customerRouter.get('/customer-quote', requireAuth, getCustomerInfo)