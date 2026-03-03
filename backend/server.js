import express from 'express';
import { authRouter } from './routes/auth.routes.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT
const app = express();

app.use(express.json())
app.use(authRouter)




app.listen(PORT, () => {
    console.log(`Server is running smooth on PORT: ${PORT}`)
})
