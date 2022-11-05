import { Request } from 'express';
import { db } from '../../main';

export abstract class UseCase {
    abstract call(req: Request): any;

    async getNumberOfItemsInTable(table: string): Promise<number> {
        const response = await db.query(`SELECT count(*) FROM ${table}`);

        return response[0].count;
    }
}
