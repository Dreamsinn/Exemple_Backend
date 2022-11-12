import { TablesName } from '../../../domain/enums/TablesNameEnum';
import { Todo } from '../../../domain/interficies/todo/Todo';
import { UseCaseData } from '../../../domain/interficies/UseCaseData';
import { PostTodoBody } from '../../../domain/schemas';
import { TodoService } from '../../../infraestructure/services/todoService';
import { CreateTodo } from '../../../use-cases/todo/createTodo';

jest.mock('../../../infraestructure/services/todoService', () => {
    return {
        TodoService: jest.fn().mockImplementation(() => {
            return {
                createTodo: jest.fn(async (description) => {
                    const newTodo: Todo[] = [
                        {
                            id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                            description: description,
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

const body: PostTodoBody = { description: 'Create Todo Test' };
const request: UseCaseData<PostTodoBody> = {
    body,
    query: {},
    params: {},
};

test('Create todo', async () => {
    const todoService: any = new TodoService();
    const response = await new CreateTodo(todoService).call(request);

    expect(todoService.createTodo.mock.calls).toEqual([['Create Todo Test']]);
    expect(response.table).toBe(TablesName.TODO);
    expect(response.items).toBeDefined();
    expect(response.items.id).toBe('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    expect(response.items.description).toBe(body.description);
    expect(response.items.create_at).toBeInstanceOf(Date);
    expect(response.items.update_at).not.toBeDefined();
});
