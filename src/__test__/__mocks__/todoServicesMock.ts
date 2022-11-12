import { Pool } from 'pg';
import { ErrorHandling } from '../../domain/enums/ErrorHandlingEnum';
import { PaginationMetadata } from '../../domain/interficies/paginationData';
import { Todo } from '../../domain/interficies/todo/Todo';
import { DataBaseConection } from '../../infraestructure/services/database/databaseConection';
import { TodoService } from '../../infraestructure/services/todoService';

export class MockTodoService extends DataBaseConection implements TodoService {
    private MockPool: Pool;
    private tableName: string;

    constructor(MockPool: Pool, tableName: string) {
        super();
        this.MockPool = MockPool;
        this.tableName = tableName;
    }

    protected async Mockquery(text: string, values?: any[]) {
        const response = await this.MockPool.query({ text, values });

        return response.rows;
    }

    public countTodos = jest.fn(async (): Promise<number> => {
        const rawCount = await this.Mockquery(
            `SELECT count(*) FROM ${this.tableName}`,
        );
        console.log({ count: rawCount[0].count });
        return rawCount[0].count;
    });

    public getAllTodos = jest.fn(
        async (
            orderBy: string,
            sortBy: string,
            metadata: PaginationMetadata,
        ): Promise<Todo[]> => {
            const response: Todo[] = await this.Mockquery(
                `SELECT * FROM ${this.tableName} ORDER BY ${orderBy} ${sortBy} offset ${metadata.offset} LIMIT ${metadata.limit}`,
            );

            if (!response.length) {
                throw new Error(ErrorHandling.NO_CONTENT);
            }

            return response;
        },
    );

    public getTodoByIds = jest.fn(
        async (queryVariables: string, idsList: string[]): Promise<Todo[]> => {
            const response: Todo[] = await this.Mockquery(
                `SELECT * FROM ${this.tableName} WHERE id IN (${queryVariables})`,
                idsList,
            );

            if (!response.length) {
                throw new Error(ErrorHandling.NOT_FOUND);
            }

            return response;
        },
    );

    public createTodo = jest.fn(
        async (description: string): Promise<Todo[]> => {
            const response: Todo[] = await this.Mockquery(
                `INSERT INTO ${this.tableName} (description) VALUES ($1) RETURNING *`,
                [description],
            );

            return response;
        },
    );

    public updateTodoById = jest.fn(
        async (description: string, id: string): Promise<Todo[]> => {
            const response: Todo[] = await this.Mockquery(
                `UPDATE ${this.tableName} SET description = $1, update_at = $3 WHERE id = $2 RETURNING *`,
                [description, id, new Date()],
            );

            if (!response.length) {
                throw new Error(ErrorHandling.NOT_FOUND);
            }

            return response;
        },
    );

    public deleteTodoById = jest.fn(async (id: string): Promise<void> => {
        const response = await this.Mockquery(
            `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`,
            [id],
        );

        if (!response.length) {
            throw new Error(ErrorHandling.NOT_FOUND);
        }

        return;
    });
}
