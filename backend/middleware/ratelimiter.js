import { rateLimit } from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 25,
    message: { success: false, error: 'Limit has been reached, please wait to try again.' }
})