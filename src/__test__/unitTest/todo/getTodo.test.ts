import { PagginationSort } from '../../../domain/enums/PaginationSort';
import { PaginationMetadata } from '../../../domain/interficies/paginationData';
import { Todo } from '../../../domain/interficies/todo/Todo';
import { UseCaseData } from '../../../domain/interficies/UseCaseData';
import { TodoService } from '../../../infraestructure/services/todoService';
import { GetAllTodos } from '../../../use-cases';

jest.mock('../../../infraestructure/services/todoService', () => {
    return {
        TodoService: jest.fn().mockImplementation(() => {
            return {
                countTodos: jest.fn().mockResolvedValue(25),
                getAllTodos: jest.fn(async (description) => {
                    const newTodo: Todo[] = [
                        {
                            id: '0a0113d4-5fc3-48e3-8736-00b825731338',
                            description: 'Hacer unas llamadas',
                            create_at: new Date(),
                            update_at: new Date(),
                        },
                        {
                            id: '4322b57d-0494-4580-b0ed-6b076e2d9f4b',
                            description: 'Configurar la pantalla de carga',
                            create_at: new Date(),
                            update_at: null,
                        },
                        {
                            id: 'abe15873-0ab9-4ee4-94a9-e23136881619',
                            description: 'Recordar',
                            create_at: new Date(),
                            update_at: null,
                        },
                    ];
                    return newTodo;
                }),
            };
        }),
    };
});

const metadata: PaginationMetadata = {
    offset: 6,
    limit: 3,
    page: 3,
    pageCount: 9,
    count: 25,
    links: {
        self: '?offset=6&limit=3',
        first: '?offset=0&limit=3',
        prev: '?offset=3&limit=3',
        next: '?offset=9&limit=3',
        last: '?offset=24&limit=3',
    },
};

describe('Get todos', () => {
    it('offset = 6, limit = 3', async () => {
        const request: UseCaseData<any> = {
            body: {},
            query: { offset: '6', limit: '3' },
            params: {},
        };
        const todoService: any = new TodoService();
        const response = await new GetAllTodos(todoService).call(request);

        expect(todoService.countTodos.mock.calls.length).toBe(1);
        expect(todoService.getAllTodos.mock.calls).toEqual([
            ['create_at', 'asc', metadata],
        ]);
        expect(response.items.length).toBe(3);
        expect(response.items[0].id).toBe(
            '0a0113d4-5fc3-48e3-8736-00b825731338',
        );
        expect(response.items[1].description).toBe(
            'Configurar la pantalla de carga',
        );
        expect(response.items[0].create_at).toBeInstanceOf(Date);
        expect(response.items[0].update_at).toBeInstanceOf(Date);
        expect(response.items[1].update_at).not.toBeDefined();
        expect(response.metadata).toEqual(metadata);
    });

    it('Default query params', async () => {
        const request: UseCaseData<any> = {
            body: {},
            query: {},
            params: {},
        };
        const todoService: any = new TodoService();
        await new GetAllTodos(todoService).call(request);

        expect(todoService.getAllTodos.mock.calls).toEqual([
            [
                'create_at',
                'asc',
                {
                    offset: 0,
                    limit: 10,
                    page: 1,
                    pageCount: 3,
                    count: 25,
                    links: {
                        self: '?offset=0&limit=10',
                        first: '?offset=0&limit=10',
                        prev: '?offset=0&limit=10',
                        next: '?offset=10&limit=10',
                        last: '?offset=20&limit=10',
                    },
                },
            ],
        ]);
    });

    it('sortBy = desc, orderBy = create_at', async () => {
        const request: UseCaseData<any> = {
            body: {},
            query: { sortBy: PagginationSort.DESC, orderBy: 'description' },
            params: {},
        };
        const todoService: any = new TodoService();
        await new GetAllTodos(todoService).call(request);

        expect(todoService.getAllTodos.mock.calls[0][0]).toBe('description');
        expect(todoService.getAllTodos.mock.calls[0][1]).toBe('desc');
    });
});
