import { Request } from 'express';
import { UseCase } from '../../domain/interficies/UseCase';
import { db } from '../../main';
import { Pagination } from '../utility/pagination';

export class GetAllTodos extends UseCase {
    public async call({ query, ...req }: Request) {
        const count = await this.getNumberOfItemsInTable('todo');

        const { metadata, sortBy, orderBy } = new Pagination(
            query,
            count,
        ).call();

        const response = await db.query(
            `SELECT * FROM todo ORDER BY ${orderBy} ${sortBy} offset ${metadata.offset} LIMIT ${metadata.limit}`,
        );

        return { metadata, response };
    }
}
