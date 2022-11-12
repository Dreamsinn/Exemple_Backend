import { TodoOutput } from '../../domain/interficies/todo/TodoOutput';
import { GetResponseData } from '../../domain/interficies/response/ResponseData';
import { UseCase } from '../UseCase';
import { Pagination } from '../utility/pagination';
import { Todo } from '../../domain/interficies/todo/Todo';
import { TodoService } from '../../infraestructure/services/todoService';
import { UseCaseData } from '../../domain/interficies/UseCaseData';

export class GetAllTodos extends UseCase {
    private todoService: TodoService;

    constructor(service: TodoService) {
        super();
        this.todoService = service;
    }

    public async call({
        query,
        ...props
    }: UseCaseData<any>): Promise<GetResponseData<TodoOutput[]>> {
        const count = await this.todoService.countTodos();

        const { metadata, sortBy, orderBy } = new Pagination(
            query,
            count,
        ).call();

        const response: Todo[] = await this.todoService.getAllTodos(
            orderBy,
            sortBy,
            metadata,
        );

        const items = this.mapResponse(response);

        return { items, metadata };
    }

    private mapResponse(response: Todo[]): TodoOutput[] {
        const output = response.map((todo: Todo) => {
            if (todo.update_at) {
                const mappedTodo = {
                    id: todo.id,
                    description: todo.description,
                    create_at: todo.create_at,
                    update_at: todo.update_at,
                };

                return mappedTodo;
            }

            const mappedTodo = {
                id: todo.id,
                description: todo.description,
                create_at: todo.create_at,
            };

            return mappedTodo;
        });

        return output;
    }
}
