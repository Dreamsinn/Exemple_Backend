import { Todo } from '../../../domain/interficies/todo/Todo';
import { UseCaseData } from '../../../domain/interficies/UseCaseData';
import { TodoService } from '../../../infraestructure/services/todoService';
import { GetTodoById } from '../../../use-cases';

jest.mock('../../../infraestructure/services/todoService', () => {
    return {
        TodoService: jest.fn().mockImplementation(() => {
            return {
                getTodoByIds: jest.fn(),
            };
        }),
    };
});

const oneIdImplementation: Todo[] = [
    {
        id: '0a0113d4-5fc3-48e3-8736-00b825731338',
        description: 'Hacer unas llamadas',
        create_at: new Date(),
        update_at: new Date(),
    },
];

const twoIdImplementation: Todo[] = [
    {
        id: '0a0113d4-5fc3-48e3-8736-00b825731338',
        description: 'Hacer unas llamadas',
        create_at: new Date(),
        update_at: new Date(),
    },
    {
        id: '336573fa-3757-4391-a3db-ebac6d42ff03',
        description: 'Hacer unas llamadas mas',
        create_at: new Date(),
        update_at: null,
    },
];

describe('Get todos by id', () => {
    it('One Id as parameter', async () => {
        const request: UseCaseData<any> = {
            body: {},
            query: {},
            params: { id: '0a0113d4-5fc3-48e3-8736-00b825731338' },
        };
        const todoService: any = new TodoService();
        todoService.getTodoByIds.mockReturnValue(oneIdImplementation);
        const response: any = await new GetTodoById(todoService).call(request);

        expect(todoService.getTodoByIds.mock.calls[0][0]).toEqual('$1');
        expect(todoService.getTodoByIds.mock.calls[0][1]).toEqual([
            '0a0113d4-5fc3-48e3-8736-00b825731338',
        ]);
        expect(response.metadata).not.toBeDefined();
        expect(response.items.id).toBe('0a0113d4-5fc3-48e3-8736-00b825731338');
    });

    it('Two Id as parameter', async () => {
        const request: UseCaseData<any> = {
            body: {},
            query: {},
            params: {
                id: '0a0113d4-5fc3-48e3-8736-00b825731338,336573fa-3757-4391-a3db-ebac6d42ff03',
            },
        };
        const todoService: any = new TodoService();
        todoService.getTodoByIds.mockReturnValue(twoIdImplementation);
        const response: any = await new GetTodoById(todoService).call(request);

        expect(todoService.getTodoByIds.mock.calls[0][0]).toEqual('$1, $2');
        expect(todoService.getTodoByIds.mock.calls[0][1]).toEqual([
            '0a0113d4-5fc3-48e3-8736-00b825731338',
            '336573fa-3757-4391-a3db-ebac6d42ff03',
        ]);
        expect(todoService.getTodoByIds.mock.calls.length).toBe(1);
        expect(response.metadata).not.toBeDefined();
        expect(response.items[0].id).toBe(
            '0a0113d4-5fc3-48e3-8736-00b825731338',
        );
        expect(response.items.length).toBe(2);
        expect(response.items[1].update_at).not.toBeDefined();
    });
});
