import express from 'express';
import { authRouter } from './routes/auth.routes.js';
import { customerRouter } from './routes/customer.routes.js';
import { emailRouter } from './routes/email.route.js';
import { jobRouter } from './routes/job.routes.js';
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT
const app = express();

app.use(cors({
    origin:'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use('/api', authRouter)
app.use('/api', customerRouter)
app.use('/api', emailRouter)
app.use('/api', jobRouter)





app.listen(PORT, () => {
    console.log(`Server is running smooth on PORT: ${PORT}`)
})
