import express from 'express';
import CustomerControllers from "../controllers/customer.controllers.js";
import AuthMiddleware from '../middleware/auth.middleware.js';

const customerRouter = express.Router();

customerRouter.use(AuthMiddleware.verifyToken);
customerRouter.get('/all-customers', CustomerControllers.getAllUserCustomers);
customerRouter.get('/customer-info', CustomerControllers.getCustomerInfo);
customerRouter.get('/customer-status', CustomerControllers.getCustomerStatus);
customerRouter.get('/customer-quote', CustomerControllers.getCustomerQuoteInfo);
customerRouter.post('/create-quote', CustomerControllers.createCustomerQuote);
customerRouter.delete('/delete-quote', CustomerControllers.deleteCustomerQuote);

export default customerRouter;