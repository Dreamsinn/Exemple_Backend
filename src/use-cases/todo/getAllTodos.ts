import { Request } from 'express';
import QueryString from 'qs';
import { PagginationSort } from '../../domain/enums/PaginationSort';
import { PaginationMetadata } from '../../domain/interficies/paginationMetadata';
import { PagginationParams } from '../../domain/interficies/PaginationParams';
import { UseCase } from '../../domain/interficies/UseCase';
import { db } from '../../main';
import { Pagination } from '../utility/pagination';

export class GetAllTodos extends UseCase {
    public async call({ query, ...req }: Request) {
        const metadata = await this.getPaginationMetadata(query);

        // return await db.query('SELECT * FROM todo');

        return metadata;
    }

    private async getPaginationMetadata(
        query: QueryString.ParsedQs,
    ): Promise<PaginationMetadata> {
        let sort: PagginationSort | undefined;
        if (query?.sort) {
            sort =
                sort === PagginationSort.ASC
                    ? PagginationSort.ASC
                    : PagginationSort.DESC;
        }

        const params: PagginationParams = {
            offSet: Number(query?.offset) || undefined,
            limit: Number(query?.limit) || undefined,
            sort,
        };

        const count = await this.getNumberOfItemsInTable();

        return new Pagination(params, count).call();
    }

    private async getNumberOfItemsInTable(): Promise<number> {
        const response = await db.query('SELECT count(*) FROM todo');

        return response[0].count;
    }
}
