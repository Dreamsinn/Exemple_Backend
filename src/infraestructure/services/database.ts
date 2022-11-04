import { Pool } from 'pg';

export class DataBaseConection {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            user: process.env.BD_USER,
            password: process.env.BD_PASSWORD,
            database: process.env.BD_NAME,
            host: 'localhost',
            port: Number(process.env.BD_PORT),
        });
    }

    public async query(text: string, values?: any[]) {
        const response = await this.pool.query({ text, values });
        return response.rows;
    }
}
