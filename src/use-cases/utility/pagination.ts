import { PagginationSort } from '../../domain/enums/PaginationSort';
import { DefaultPaginationQueryParams } from '../../domain/interficies/defaultPaginiationQueryParams';
import {
    PaginationLinks,
    PaginationMetadata,
} from '../../domain/interficies/paginationMetadata';
import { PagginationParams } from '../../domain/interficies/PaginationParams';

export const DEFAUL_PAGINATION_QUERY_VALUES: DefaultPaginationQueryParams = {
    offset: 0,
    limit: 10,
    sort: PagginationSort.ASC,
};

// migration uuid como id, nuevos campos: created_at, updated_at

export class Pagination {
    private limit: number;
    private offSet: number;
    private count: number;

    constructor(params: PagginationParams, count: number) {
        this.limit = params.limit ?? DEFAUL_PAGINATION_QUERY_VALUES.limit;
        this.offSet = params.offSet ?? DEFAUL_PAGINATION_QUERY_VALUES.offset;
        this.count = count;
    }

    public call(): PaginationMetadata {
        const page = this.pageCalculation();
        const pageCount = this.pageCountCalculation();

        const metadata: PaginationMetadata = {
            offset: this.offSet,
            limit: this.limit,
            page,
            pageCount,
            count: this.count,
            links: this.createPaginacionLinks(pageCount),
        };

        return metadata;
    }

    private pageCalculation(): number {
        return Math.floor(this.offSet / this.limit + 1);
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
            self: `?offset=${this.offSet}&limit=${this.limit}`,
            first: `?offset=0&limit=${this.limit}`,
            prev: this.prevLinkCalculation(),
            next: this.nextLinkCalculation(pageCount),
            last: this.lastLinkCalculation(pageCount),
        };

        return links;
    }

    private prevLinkCalculation(): string {
        const offSet =
            this.offSet - this.limit > 0 ? this.offSet - this.limit : 0;

        return `?offset=${offSet}&limit=${this.limit}`;
    }

    private nextLinkCalculation(lastPage: number): string {
        const lastPageOffset = Math.floor(lastPage) * this.limit;
        let offSet = this.offSet + this.limit;

        offSet = offSet < lastPageOffset ? offSet : lastPageOffset;

        return `?offset=${offSet}&limit=${this.limit}`;
    }

    private lastLinkCalculation(lastPage: number): string {
        const offSet = Math.floor(lastPage) * this.limit;

        return `?offset=${offSet}&limit=${this.limit}`;
    }
}
