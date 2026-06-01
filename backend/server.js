import dotenv from 'dotenv';
import express from 'express';
import authRouter from "./routes/auth.routes.js";
import customerRouter from './routes/customer.routes.js';
import emailRouter from './routes/email.route.js';
import jobRouter from './routes/job.routes.js';
import notiRouter  from './routes/notifications.routes.js';
import { AppError, AuthenticationError } from "./error/error.handler.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();

const PORT = process.env.PORT
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true
}))

app.use('/api', authRouter)
app.use('/api', customerRouter)
app.use('/api', emailRouter)
app.use('/api', jobRouter)
app.use('/api', notiRouter)





app.use((err, req, res, next) => {
	let msg = "Server error";
	let statusCode = 500;
	if(err instanceof AppError){
		return res.status(err.status).json({ error: err.message })
	}
	res.status(statusCode).json({ error: msg })
})

app.listen(PORT, () => {
    console.log(`Server is running smooth on PORT: ${PORT}`)
})
