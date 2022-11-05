import { PagginationSort } from '../../domain/enums/PaginationSort';
import { DefaultPaginationQueryParams } from '../../domain/interficies/defaultPaginiationQueryParams';
import {
    PaginationData,
    PaginationLinks,
    PaginationMetadata,
} from '../../domain/interficies/paginationData';
import { PaginationParams } from '../../domain/interficies/PaginationParams';
import QueryString from 'qs';

export const DEFAUL_PAGINATION_QUERY_VALUES: DefaultPaginationQueryParams = {
    offset: 0,
    limit: 10,
    sortBy: PagginationSort.ASC,
    orderBy: 'create_at',
};

export class Pagination {
    private limit: number;
    private offset: number;
    private sortBy: PagginationSort;
    private orderBy: string;
    private count: number;

    constructor(queryParams: QueryString.ParsedQs, count: number) {
        const { limit, offset, sortBy, orderBy } =
            this.formatPaginationData(queryParams);

        this.limit = limit ?? DEFAUL_PAGINATION_QUERY_VALUES.limit;
        this.offset = offset ?? DEFAUL_PAGINATION_QUERY_VALUES.offset;
        this.sortBy = sortBy ?? DEFAUL_PAGINATION_QUERY_VALUES.sortBy;
        this.orderBy = orderBy ?? DEFAUL_PAGINATION_QUERY_VALUES.orderBy;
        this.count = count;
    }

    private formatPaginationData(
        queryParams: QueryString.ParsedQs,
    ): PaginationParams {
        let sortBy: PagginationSort | undefined;
        if (queryParams?.sortBy) {
            sortBy =
                sortBy === PagginationSort.ASC
                    ? PagginationSort.ASC
                    : PagginationSort.DESC;
        }

        let orderBy: string | undefined;
        if (queryParams?.orderBy) {
            orderBy = String(queryParams?.orderBy);
        }

        const params: PaginationParams = {
            offset: Number(queryParams?.offset) || undefined,
            limit: Number(queryParams?.limit) || undefined,
            sortBy,
            orderBy,
        };

        return params;
    }

    public call(): PaginationData {
        const metadata = this.createMetadata();

        return {
            metadata,
            sortBy: this.sortBy,
            orderBy: this.orderBy,
        };
    }

    private createMetadata(): PaginationMetadata {
        const page = this.pageCalculation();
        const pageCount = this.pageCountCalculation();

        const metadata: PaginationMetadata = {
            offset: this.offset,
            limit: this.limit,
            page,
            pageCount,
            count: this.count,
            links: this.createPaginacionLinks(pageCount),
        };

        return metadata;
    }

    private pageCalculation(): number {
        return Math.floor(this.offset / this.limit + 1);
    }

    private pageCountCalculation(): number {
        const maxPage = this.count / this.limit;

        if (maxPage % 1 !== 0) {
            return Math.ceil(maxPage);
        }

        return maxPage;
    }

    private createPaginacionLinks(pageCount: number): PaginationLinks {
        const links: PaginationLinks = {
            self: `?offset=${this.offset}&limit=${this.limit}`,
            first: `?offset=0&limit=${this.limit}`,
            prev: this.prevLinkCalculation(),
            next: this.nextLinkCalculation(pageCount),
            last: this.lastLinkCalculation(pageCount),
        };

        return links;
    }

    private prevLinkCalculation(): string {
        const offset =
            this.offset - this.limit > 0 ? this.offset - this.limit : 0;

        return `?offset=${offset}&limit=${this.limit}`;
    }

    private nextLinkCalculation(lastPage: number): string {
        const lastPageOffset = Math.floor(lastPage) * this.limit;
        let offset = this.offset + this.limit;

        offset = offset < lastPageOffset ? offset : lastPageOffset;

        return `?offset=${offset}&limit=${this.limit}`;
    }

    private lastLinkCalculation(lastPage: number): string {
        const offSet = Math.floor(lastPage) * this.limit;

        return `?offset=${offSet}&limit=${this.limit}`;
    }
}
