import dotenv from 'dotenv';
const envPath = new URL("./.env", import.meta.url).pathname;
dotenv.config({ path: envPath});
import express from 'express';
import authRouter from "./routes/auth.routes.js";
import customerRouter from './routes/customer.routes.js';
import emailRouter from './routes/email.route.js';
import jobRouter from './routes/job.routes.js';
import notiRouter  from './routes/notifications.routes.js';
import { AppError } from "./error/error.handler.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';

const PORT = process.env.PORT
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true
}))

app.get("/404", (req, res) => {
	return res.sendFile(path.join(__dirname, "build", "index.html"));
})


app.use('/api', authRouter)
app.use('/api', customerRouter)
app.use('/api', emailRouter)
app.use('/api', jobRouter)
app.use('/api', notiRouter)



app.use((err, req, res, next) => {
	let status = 500;
	if(err instanceof AppError){
		return res.status(err.statusCode).json({ error: err.message })
	}
	return res.status(err.statusCode || status).json({ error: err.message })
})

app.listen(PORT, () => {
    console.log(`Server is running smooth on PORT: ${PORT}`)
})
