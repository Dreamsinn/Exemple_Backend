import { Request } from 'express';
import { GetTodosOutput } from '../../domain/interficies/todo/GetTodosOutput';
import { GetResponseData } from '../../domain/interficies/response/ResponseData';
import { UseCase } from '../../domain/interficies/UseCase';
import { db } from '../../main';
import { Pagination } from '../utility/pagination';
import { Todo } from '../../domain/interficies/todo/Todo';

export class GetAllTodos extends UseCase {
    public async call({
        query,
        ...req
    }: Request): Promise<GetResponseData<GetTodosOutput[]>> {
        const count = await this.getNumberOfItemsInTable('todo');

        const { metadata, sortBy, orderBy } = new Pagination(
            query,
            count,
        ).call();

        const response: Todo[] = await db.query(
            `SELECT * FROM todo ORDER BY ${orderBy} ${sortBy} offset ${metadata.offset} LIMIT ${metadata.limit}`,
        );

        const items = this.mapResponse(response);

        return { items, metadata };
    }

    private mapResponse(response: Todo[]): GetTodosOutput[] {
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
