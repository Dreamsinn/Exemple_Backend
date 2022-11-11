import { TablesName } from '../../domain/enums/TablesNameEnum';
import { PostResponseData } from '../../domain/interficies/response/ResponseData';
import { Todo } from '../../domain/interficies/todo/Todo';
import { TodoOutput } from '../../domain/interficies/todo/TodoOutput';
import { UseCase } from '../UseCase';
import { PostTodoBody } from '../../domain/schemas';
import { TodoService } from '../../infraestructure/services/todoService';
import { UseCaseData } from '../../domain/interficies/UseCaseData';

export class CreateTodo extends UseCase {
    private todoService: TodoService;

    constructor(service: TodoService) {
        super();
        this.todoService = service;
    }

    public async call({
        body,
        ...props
    }: UseCaseData<PostTodoBody>): Promise<PostResponseData<TodoOutput>> {
        const { description } = body;
        const response: Todo[] = await this.todoService.createTodo(description);

        const items = this.formatResponse(response);

        return { table: TablesName.TODO, items };
    }

    private formatResponse(response: Todo[]): TodoOutput {
        const output = {
            id: response[0].id,
            description: response[0].description,
            create_at: response[0].create_at,
        };

        return output;
    }
}
