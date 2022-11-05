import { PagginationSort } from '../enums/PaginationSort';

export interface DefaultPaginationQueryParams {
    readonly offset: number;
    readonly limit: number;
    readonly sort: PagginationSort;
}
