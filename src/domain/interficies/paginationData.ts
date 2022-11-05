export interface PaginationData {
    metadata: PaginationMetadata;
    sortBy: string;
    orderBy: string;
}

export interface PaginationMetadata {
    offset: number;
    limit: number;
    page: number;
    pageCount: number;
    count: number;
    links: PaginationLinks;
}

export interface PaginationLinks {
    self: string;
    first: string;
    prev: string;
    next: string;
    last: string;
}
