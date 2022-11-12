import { TablesName } from '../../../domain/enums/TablesNameEnum';
import { UseCaseData } from '../../../domain/interficies/UseCaseData';
import { TodoService } from '../../../infraestructure/services/todoService';
import { DeleteTodoById } from '../../../use-cases';

jest.mock('../../../infraestructure/services/todoService', () => {
    return {
        TodoService: jest.fn().mockImplementation(() => {
            return {
                deleteTodoById: jest.fn(async (id: string) => {
                    return;
                }),
            };
        }),
    };
});

const request: UseCaseData<any> = {
    body: {},
    query: {},
    params: { id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
};

test('Delete todo', async () => {
    const todoService: any = new TodoService();
    const response = await new DeleteTodoById(todoService).call(request);

    expect(todoService.deleteTodoById.mock.calls).toEqual([
        ['xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'],
    ]);
    expect(response).toStrictEqual({ table: TablesName.TODO });
});
