/** @format */

import { Pool } from 'pg';

export const pool = new Pool({
    user: process.env.BD_USER,
    password: process.env.BD_PASSWORD,
    database: process.env.BD_NAME,
    host: 'localhost',
    port: Number(process.env.BD_PORT),
});
