import { Pagination } from '../../use-cases';
import QueryString from 'qs';

describe('Pagination util', () => {
    it('Default query params, count = 45', () => {
        const response = new Pagination({}, 45).call();

        expect(response.sortBy).toBe('asc');
        expect(response.orderBy).toBe('create_at');
        expect(response.metadata.offset).toBe(0);
        expect(response.metadata.limit).toBe(10);
        expect(response.metadata.count).toBe(45);
        expect(response.metadata.page).toBe(1);
        expect(response.metadata.pageCount).toBe(5);
        expect(response.metadata.links).toEqual({
            self: '?offset=0&limit=10',
            first: '?offset=0&limit=10',
            prev: '?offset=0&limit=10',
            next: '?offset=10&limit=10',
            last: '?offset=40&limit=10',
        });
    });

    it('Query params: offset = 30, limit = 15, sortBy = desc, orderBy = id, count 45', () => {
        const queryParameters: QueryString.ParsedQs = {
            offset: '30',
            limit: '15',
            sortBy: 'desc',
            orderBy: 'id',
        };
        const response = new Pagination(queryParameters, 45).call();

        expect(response.sortBy).toBe('desc');
        expect(response.orderBy).toBe('id');
        expect(response.metadata.offset).toBe(30);
        expect(response.metadata.limit).toBe(15);
        expect(response.metadata.page).toBe(3);
        expect(response.metadata.pageCount).toBe(3);
        expect(response.metadata.links).toEqual({
            self: '?offset=30&limit=15',
            first: '?offset=0&limit=15',
            prev: '?offset=15&limit=15',
            next: '?offset=30&limit=15',
            last: '?offset=30&limit=15',
        });
    });
});
