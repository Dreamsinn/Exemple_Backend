import { PagginationSort } from '../enums/PaginationSort';

export interface PaginationParams {
    limit: number | undefined;
    offset: number | undefined;
    sortBy: PagginationSort | undefined;
    orderBy: string | undefined;
}
