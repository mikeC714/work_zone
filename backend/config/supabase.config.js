import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

export const db = createClient(
    process.env.SUPA_URL,   
    process.env.SUPA_SERVICE
)

export const supAuth = createClient(
    process.env.SUPA_URL,
    process.env.SUPA_KEY
)

