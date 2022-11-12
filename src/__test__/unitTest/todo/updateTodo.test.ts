import { TablesName } from '../../../domain/enums/TablesNameEnum';
import { UseCaseData } from '../../../domain/interficies/UseCaseData';
import { PutTodoByIdBody } from '../../../domain/schemas';
import { TodoService } from '../../../infraestructure/services/todoService';
import { UpdateTodoById } from '../../../use-cases';

jest.mock('../../../infraestructure/services/todoService', () => {
    return {
        TodoService: jest.fn().mockImplementation(() => {
            return {
                updateTodoById: jest.fn(async (description) => {
                    return;
                }),
            };
        }),
    };
});

const body: PutTodoByIdBody = { description: 'Create Todo Test' };
const request: UseCaseData<PutTodoByIdBody> = {
    body,
    query: {},
    params: { id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
};

test('Update todo', async () => {
    const todoService: any = new TodoService();
    const response = await new UpdateTodoById(todoService).call(request);

    expect(todoService.updateTodoById.mock.calls).toEqual([
        ['Create Todo Test', 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'],
    ]);
    expect(response.table).toBe(TablesName.TODO);
    expect(response.id).toBe('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
});
