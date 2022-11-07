import { Pool } from 'pg';

export abstract class DataBaseConection {
    private static pool: Pool = new Pool({
        user: process.env.BD_USER,
        password: process.env.BD_PASSWORD,
        database: process.env.BD_NAME,
        host: 'localhost',
        port: Number(process.env.BD_PORT),
    });

    protected async query(text: string, values?: any[]) {
        const response = await DataBaseConection.pool.query({ text, values });
        return response.rows;
    }
}
