import { Request } from 'express';
import { GetResponseData } from '../../domain/interficies/response/ResponseData';
import { GetTodosOutput } from '../../domain/interficies/todo/GetTodosOutput';
import { Todo } from '../../domain/interficies/todo/Todo';
import { UseCase } from '../../domain/interficies/UseCase';
import { db } from '../../main';

export class GetTodoById extends UseCase {
    public async call({
        params,
        ...req
    }: Request): Promise<GetResponseData<GetTodosOutput | GetTodosOutput[]>> {
        const id: string = params.id;

        const idsList = id.split(',');

        const queryVariables = this.createqueryVariables(idsList);

        const response: Todo[] = await db.query(
            `SELECT * FROM todo WHERE id IN (${queryVariables})`,
            idsList,
        );

        const items = this.mapResponse(response);

        if (items.length === 1) {
            return { items: items[0] };
        }

        return { items };
    }

    private createqueryVariables(idsList: string[]): string {
        let queryString = '';

        for (let i = 1; idsList.length > i - 1; i++) {
            queryString += `$` + i + ', ';
        }

        return queryString.slice(0, -2);
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
