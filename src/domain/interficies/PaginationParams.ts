import { PagginationSort } from '../enums/PaginationSort';

export interface PagginationParams {
    limit: number | undefined;
    offSet: number | undefined;
    sort: PagginationSort | undefined;
}
