import { ErrorHandling } from '../../domain/enums/ErrorHandlingEnum';
import { PaginationMetadata } from '../../domain/interficies/paginationData';
import { Todo } from '../../domain/interficies/todo/Todo';
import { DataBaseConection } from './database/databaseConection';

export class TodoService extends DataBaseConection {
    public async countTodos(): Promise<number> {
        const rawCount = await this.query('SELECT count(*) FROM todo');

        return rawCount[0].count;
    }

    public async getAllTodos(
        orderBy: string,
        sortBy: string,
        metadata: PaginationMetadata,
    ): Promise<Todo[]> {
        const response: Todo[] = await this.query(
            `SELECT * FROM todo ORDER BY ${orderBy} ${sortBy} offset ${metadata.offset} LIMIT ${metadata.limit}`,
        );

        if (!response.length) {
            throw new Error(ErrorHandling.NO_CONTENT);
        }

        return response;
    }

    public async getTodoByIds(
        queryVariables: string,
        idsList: string[],
    ): Promise<Todo[]> {
        const response: Todo[] = await this.query(
            `SELECT * FROM todo WHERE id IN (${queryVariables})`,
            idsList,
        );

        if (!response.length) {
            throw new Error(ErrorHandling.NOT_FOUND);
        }

        return response;
    }

    public async createTodo(description: string): Promise<Todo[]> {
        const response: Todo[] = await this.query(
            'INSERT INTO todo (description) VALUES ($1) RETURNING *',
            [description],
        );

        return response;
    }

    public async updateTodoById(
        description: string,
        id: string,
    ): Promise<Todo[]> {
        const response: Todo[] = await this.query(
            'UPDATE todo SET description = $1, update_at = $3 WHERE id = $2 RETURNING *',
            [description, id, new Date()],
        );

        if (!response.length) {
            throw new Error(ErrorHandling.NOT_FOUND);
        }

        return response;
    }

    public async deleteTodoById(id: string): Promise<void> {
        const response = await this.query(
            'DELETE FROM todo WHERE id = $1 RETURNING *',
            [id],
        );

        if (!response.length) {
            throw new Error(ErrorHandling.NOT_FOUND);
        }

        return;
    }
}
