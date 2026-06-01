import express from 'express';
import {getAllUserCustomers, getCustomerInfo, getCustomerStatus, getCustomerQuoteInfo, createCustomerQuote, deleteCustomerQuote}  from "../controllers/customer.controllers.js";
import AuthMiddleware from '../middleware/auth.middleware.js';
import { monitorQuotes } from "../middleware/quote.middleware.js";

const customerRouter = express.Router();

customerRouter.use(AuthMiddleware.verifyToken);
customerRouter.get('/all-customers', monitorQuotes, getAllUserCustomers);
customerRouter.get('/customer-info', getCustomerInfo);
customerRouter.get('/customer-status', getCustomerStatus);
customerRouter.get('/customer-quote', getCustomerQuoteInfo);
customerRouter.post('/create-quote', createCustomerQuote);
customerRouter.delete('/delete-quote', deleteCustomerQuote);

export default customerRouter;
