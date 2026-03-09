import express from 'express';
import { getCustomerInfo, getCustomerStatus, getCustomerQuoteInfo, createCustomerQuote, deleteCustomerQuote, getAllUserCustomers } from '../controllers/customer.controllers.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const customerRouter = express.Router();

customerRouter.get('/all-customers', requireAuth, getAllUserCustomers)
customerRouter.get('/customer-info', requireAuth, getCustomerInfo)
customerRouter.get('/customer-status', requireAuth, getCustomerStatus)
customerRouter.get('/customer-quote', requireAuth, getCustomerQuoteInfo)
customerRouter.post('/create-quote', requireAuth, createCustomerQuote)
customerRouter.delete('/delete-quote/:quoteId', requireAuth, deleteCustomerQuote)
