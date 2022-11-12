import dotenv from 'dotenv';
dotenv.config();
import { Pool } from 'pg';
import request from 'supertest';
import { Route } from '../../domain/interficies/Route';
import { App } from '../../main';
import { MockTodoService } from '../__mocks__/todoServicesMock';
import { PostTodoBody, PutTodoByIdBody } from '../../domain/schemas';
import { mockTodoRoute } from '../__mocks__/routesMock';
import { validate } from 'uuid';

let pool: Pool;
const mockTable = 'mockTodo';
let mockTodoService: MockTodoService;
let mockServiceRotues: Route[];

describe('Todo table test, end to end', () => {
    beforeAll(async () => {
        // actual BD, en postproducion hacer otra bd para testing
        pool = new Pool({
            user: process.env.BD_USER,
            password: process.env.BD_PASSWORD,
            database: process.env.BD_NAME,
            host: 'localhost',
            port: Number(process.env.BD_PORT),
        });

        // crear una tabal temporal, pueden tener mismo nombre, pero no se podra acceder a la original hasta que se borre la temporal
        await pool.query(
            `CREATE TEMPORARY TABLE ${mockTable} (LIKE todo INCLUDING ALL)`,
        ); // crea con la misma estructura

        await pool.query(
            `INSERT INTO ${mockTable} (description) VALUES ($1), ($2), ($3), ($4)`,
            [
                'Description for testing 1',
                'Description for testing 2',
                'Description for testing 3',
                'Description for testing 4',
            ],
        );

        mockTodoService = new MockTodoService(pool, mockTable);
        mockServiceRotues = mockTodoRoute(mockTodoService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await pool.query(`DROP TABLE IF EXISTS ${mockTable}`);
    });

    describe('Create Todo, POST /todo', () => {
        let count: string;

        beforeAll(async () => {
            count = (await pool.query(`SELECT count(*) FROM ${mockTable}`))
                .rows[0].count;
        });

        it('Ok response', async () => {
            const server: App = new App(mockServiceRotues);
            const body: PostTodoBody = {
                description: 'Todo test',
            };
            const response: any = await request(server.app)
                .post('/todo')
                .send(body);

            const countAfterPost = (
                await pool.query(`SELECT count(*) FROM ${mockTable}`)
            ).rows[0].count;
            const parsedResponse = JSON.parse(response.text);

            expect(Number(countAfterPost)).toEqual(Number(count) + 1);
            expect(mockTodoService.createTodo.mock.calls).toEqual([
                ['Todo test'],
            ]);
            expect(parsedResponse.status).toBe(201);
            expect(parsedResponse.statusText).toBe('Todo created successfully');
            expect(validate(parsedResponse.data.id)).toBe(true);
            expect(parsedResponse.data.description).toBe(body.description);
            expect(new Date(parsedResponse.data.create_at).toString()).not.toBe(
                'Invalid Date',
            );
            expect(parsedResponse.data.update_at).not.toBeDefined();
        });

        it('Error, body value: number', async () => {
            const server: App = new App(mockServiceRotues);
            const body = {
                description: 1234,
            };
            const response: any = await request(server.app)
                .post('/todo')
                .send(body);

            const parsedResponse = JSON.parse(response.text);

            expect(mockTodoService.createTodo.mock.calls).toEqual([]);
            expect(parsedResponse.status).toBe(400);
            expect(parsedResponse.statusText).toBe('Bad request');
            expect(parsedResponse.data.error.length).toBe(1);
            expect(parsedResponse.data.error[0].location).toBe('body');
            expect(parsedResponse.data.error[0].message).toBe(
                'Type: must be string.',
            );
            expect(parsedResponse.data.error[0].param).toBe('description');
            expect(parsedResponse.data.error[0].value).toBe(body.description);
        });

        it('Error, wrong body structure', async () => {
            const server: App = new App(mockServiceRotues);
            const body = {
                descrip: 'Todo test',
            };
            const response: any = await request(server.app)
                .post('/todo')
                .send(body);

            const parsedResponse = JSON.parse(response.text);

            expect(mockTodoService.createTodo.mock.calls).toEqual([]);
            expect(parsedResponse.status).toBe(400);
            expect(parsedResponse.statusText).toBe('Bad request');
            expect(parsedResponse.data.error.length).toBe(2);
            expect(parsedResponse.data.error[0].message).toBe(
                "MissingProperty: must have required property 'description'.",
            );
            expect(parsedResponse.data.error[0].param).toBe('description');
            expect(parsedResponse.data.error[1].message).toBe(
                'AdditionalProperty: must NOT have additional properties.',
            );
            expect(parsedResponse.data.error[1].param).toBe('descrip');
        });
    });

    describe('Update Todo by id, PUT /todo/:id', () => {
        let idList: { id: string }[];

        beforeAll(async () => {
            idList = (await pool.query(`SELECT id FROM ${mockTable}`)).rows;
        });

        it('Ok response', async () => {
            const server: App = new App(mockServiceRotues);
            const body: PutTodoByIdBody = {
                description: 'Todo updated test',
            };
            const response: any = await request(server.app)
                .put(`/todo/${idList[0].id}`)
                .send(body);

            const idAfterUpdate = (
                await pool.query(
                    `SELECT description FROM ${mockTable} WHERE id = $1`,
                    [idList[0].id],
                )
            ).rows;
            const parsedResponse = JSON.parse(response.text);

            expect(idAfterUpdate[0].description).toBe(body.description);
            expect(mockTodoService.updateTodoById.mock.calls).toEqual([
                [body.description, idList[0].id],
            ]);
            expect(parsedResponse.status).toBe(200);
            expect(parsedResponse.statusText).toBe('Todo updated successfully');
            expect(parsedResponse.data).toEqual({ id: idList[0].id });
        });

        it('Error, path parameter = non-existent uuid', async () => {
            const server: App = new App(mockServiceRotues);
            const body: PutTodoByIdBody = {
                description: 'Todo updated test',
            };
            const nonExistent_uuid = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
            const response: any = await request(server.app)
                .put(`/todo/${nonExistent_uuid}`)
                .send(body);

            const parsedResponse = JSON.parse(response.text);

            expect(mockTodoService.updateTodoById.mock.calls).toEqual([
                [body.description, nonExistent_uuid],
            ]);
            expect(parsedResponse.status).toBe(404);
            expect(parsedResponse.statusText).toBe('Not found');
            expect(parsedResponse.data.error).toBe(
                'Requested resource could not be found',
            );
        });

        it('Error, path parameter = non uuid', async () => {
            const server: App = new App(mockServiceRotues);
            const body: PutTodoByIdBody = {
                description: 'Todo updated test',
            };
            const non_uuid = '1';
            const response: any = await request(server.app)
                .put(`/todo/${non_uuid}`)
                .send(body);

            const parsedResponse = JSON.parse(response.text);

            expect(mockTodoService.updateTodoById.mock.calls).toEqual([]);
            expect(parsedResponse.status).toBe(400);
            expect(parsedResponse.statusText).toBe('Bad request');
            expect(parsedResponse.data.error[0].location).toBe('params');
            expect(parsedResponse.data.error[0].param).toBe('id');
            expect(parsedResponse.data.error[0].value).toBe(non_uuid);
            expect(parsedResponse.data.error[0].message).toBe(
                'Must be an uuid',
            );
        });

        it('Error, wrong body structure', async () => {
            const server: App = new App(mockServiceRotues);
            const body = {
                descrip: 'Todo updated test',
            };
            const response: any = await request(server.app)
                .put(`/todo/${idList[0].id}`)
                .send(body);

            const parsedResponse = JSON.parse(response.text);

            expect(mockTodoService.updateTodoById.mock.calls).toEqual([]);
            expect(parsedResponse.status).toBe(400);
            expect(parsedResponse.statusText).toBe('Bad request');
            expect(parsedResponse.data.error.length).toBe(2);
            expect(parsedResponse.data.error[0].message).toBe(
                "MissingProperty: must have required property 'description'.",
            );
            expect(parsedResponse.data.error[0].param).toBe('description');
            expect(parsedResponse.data.error[1].message).toBe(
                'AdditionalProperty: must NOT have additional properties.',
            );
            expect(parsedResponse.data.error[1].param).toBe('descrip');
        });

        it('Error, wrong body structure and path parameter = non uuid', async () => {
            const server: App = new App(mockServiceRotues);
            const body = {
                descrip: 'Todo updated test',
            };
            const non_uuid = 1;
            const response: any = await request(server.app)
                .put(`/todo/${non_uuid}`)
                .send(body);

            const parsedResponse = JSON.parse(response.text);

            expect(mockTodoService.updateTodoById.mock.calls).toEqual([]);
            expect(parsedResponse.status).toBe(400);
            expect(parsedResponse.statusText).toBe('Bad request');
            expect(parsedResponse.data.error.length).toBe(3);
        });
    });

    describe('Delete Todo by id, DELETE /todo/:id', () => {
        let count: string;
        let idList: { id: string }[];

        beforeAll(async () => {
            count = (await pool.query(`SELECT count(*) FROM ${mockTable}`))
                .rows[0].count;
            idList = (await pool.query(`SELECT id FROM ${mockTable}`)).rows;
        });

        it('Ok resonse', async () => {
            const server: App = new App(mockServiceRotues);
            const response: any = await request(server.app).delete(
                `/todo/${idList[0].id}`,
            );

            const countAfterDelete = (
                await pool.query(`SELECT count(*) FROM ${mockTable}`)
            ).rows[0].count;
            const parsedResponse = JSON.parse(response.text);

            expect(Number(countAfterDelete)).toBe(Number(count) - 1);
            expect(mockTodoService.deleteTodoById.mock.calls).toEqual([
                [idList[0].id],
            ]);
            expect(parsedResponse.status).toBe(204);
            expect(parsedResponse.statusText).toBe('Todo deleted successfully');
            expect(parsedResponse.data).toEqual({});
        });

        it('Error, path parameter = non-existent uuid', async () => {
            const server: App = new App(mockServiceRotues);
            const nonExistent_uuid = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
            const response: any = await request(server.app).delete(
                `/todo/${nonExistent_uuid}`,
            );

            const parsedResponse = JSON.parse(response.text);

            expect(mockTodoService.deleteTodoById.mock.calls).toEqual([
                [nonExistent_uuid],
            ]);
            expect(parsedResponse.status).toBe(404);
            expect(parsedResponse.statusText).toBe('Not found');
            expect(parsedResponse.data.error).toBe(
                'Requested resource could not be found',
            );
        });

        it('Error, path parameter = non uuid', async () => {
            const server: App = new App(mockServiceRotues);
            const non_uuid = '1';
            const response: any = await request(server.app).delete(
                `/todo/${non_uuid}`,
            );

            const parsedResponse = JSON.parse(response.text);

            expect(mockTodoService.deleteTodoById.mock.calls).toEqual([]);
            expect(parsedResponse.status).toBe(400);
            expect(parsedResponse.statusText).toBe('Bad request');
            expect(parsedResponse.data.error[0].location).toBe('params');
            expect(parsedResponse.data.error[0].param).toBe('id');
            expect(parsedResponse.data.error[0].value).toBe(non_uuid);
            expect(parsedResponse.data.error[0].message).toBe(
                'Must be an uuid',
            );
        });
    });

    describe('Get Todo by id, GET /todo/:id', () => {
        let idList: { id: string }[];

        beforeAll(async () => {
            idList = (await pool.query(`SELECT id FROM ${mockTable}`)).rows;
        });

        it('Ok response, 1 id as path parameter', async () => {
            const server: App = new App(mockServiceRotues);
            const response: any = await request(server.app).get(
                `/todo/${idList[0].id}`,
            );

            const parsedResponse = JSON.parse(response.text);

            expect(mockTodoService.getTodoByIds.mock.calls).toEqual([
                ['$1', [idList[0].id]],
            ]);
            expect(parsedResponse.status).toBe(200);
            expect(parsedResponse.statusText).toBe('Success');
            expect(parsedResponse.data.id).toBe(idList[0].id);
            expect(parsedResponse.data.description).toBeDefined();
            expect(parsedResponse.data.create_at).toBeDefined();
        });

        it('Ok response, 3 id as path parameter', async () => {
            const server: App = new App(mockServiceRotues);
            const response: any = await request(server.app).get(
                `/todo/${idList[0].id},${idList[1].id},${idList[2].id}`,
            );

            const parsedResponse = JSON.parse(response.text);

            expect(mockTodoService.getTodoByIds.mock.calls).toEqual([
                ['$1, $2, $3', [idList[0].id, idList[1].id, idList[2].id]],
            ]);
            expect(parsedResponse.status).toBe(200);
            expect(parsedResponse.statusText).toBe('Success');
            expect(parsedResponse.data[0].id).toBe(idList[0].id);
            expect(parsedResponse.data[1].id).toBe(idList[1].id);
            expect(parsedResponse.data[2].id).toBe(idList[2].id);
            expect(parsedResponse.data.length).toBe(3);
        });

        it('Ok response, 3 id as path parameter, on of them non-existent', async () => {
            const server: App = new App(mockServiceRotues);
            const nonExistent_uuid = '0aabaaaa-aaea-44aa-aaaa-aaaaaaaaaaaa';

            const response: any = await request(server.app).get(
                `/todo/${idList[0].id},${idList[1].id},${nonExistent_uuid}`,
            );

            const parsedResponse = JSON.parse(response.text);

            expect(mockTodoService.getTodoByIds.mock.calls).toEqual([
                ['$1, $2, $3', [idList[0].id, idList[1].id, nonExistent_uuid]],
            ]);
            expect(parsedResponse.status).toBe(200);
            expect(parsedResponse.statusText).toBe('Success');
            expect(parsedResponse.data[0].id).toBe(idList[0].id);
            expect(parsedResponse.data[1].id).toBe(idList[1].id);
            expect(parsedResponse.data.length).toBe(2);
        });

        it('Error, 1 non-existent uuid as path parameter', async () => {
            const server: App = new App(mockServiceRotues);
            const nonExistent_uuid = '0aabaaaa-aaea-44aa-aaaa-aaaaaaaaaaaa';
            const response: any = await request(server.app).get(
                `/todo/${nonExistent_uuid}`,
            );

            const parsedResponse = JSON.parse(response.text);

            expect(mockTodoService.getTodoByIds.mock.calls).toEqual([
                ['$1', [nonExistent_uuid]],
            ]);
            expect(parsedResponse.status).toBe(404);
            expect(parsedResponse.statusText).toBe('Not found');
            expect(parsedResponse.data.error).toBe(
                'Requested resource could not be found',
            );
        });

        it('Error, 3 id as path parameter, on of them non uuid', async () => {
            const server: App = new App(mockServiceRotues);
            const response: any = await request(server.app).get(
                `/todo/${idList[0].id},${idList[1].id}, `,
            );

            const parsedResponse = JSON.parse(response.text);

            expect(mockTodoService.getTodoByIds.mock.calls).toEqual([]);
            expect(parsedResponse.status).toBe(400);
            expect(parsedResponse.statusText).toBe('Bad request');
            expect(parsedResponse.data.error[0].location).toBe('params');
            expect(parsedResponse.data.error[0].param).toBe('id');
            expect(parsedResponse.data.error[0].message).toBe(
                "Must be an uuid, or multiple uuids splitted by ','",
            );
            expect(parsedResponse.data.error[0].value).toBe(
                `${idList[0].id},${idList[1].id},`,
            );
        });
    });

    describe('Get Todo, GET /todo', () => {
        it('Ok response, without query params', async () => {
            const server: App = new App(mockServiceRotues);
            const response: any = await request(server.app).get('/todo');

            const parsedResponse = JSON.parse(response.text);
            console.log(parsedResponse);

            expect(mockTodoService.countTodos.mock.calls).toEqual([[]]);
            expect(mockTodoService.getAllTodos.mock.calls.length).toBe(1);
            expect(mockTodoService.getAllTodos.mock.calls[0][0]).toBe(
                'create_at',
            );
            expect(mockTodoService.getAllTodos.mock.calls[0][1]).toBe('asc');
            expect(mockTodoService.getAllTodos.mock.calls[0][2].offset).toBe(0);
            expect(mockTodoService.getAllTodos.mock.calls[0][2].limit).toBe(10);

            expect(parsedResponse.status).toBe(200);
            expect(parsedResponse.statusText).toBe('Success');
            expect(parsedResponse.data.items).toBeInstanceOf(Array);
            expect(parsedResponse.data.items[0].id).toBeDefined();
            expect(parsedResponse.data.items[0].description).toBeDefined();
            expect(
                new Date(parsedResponse.data.items[0].create_at).toString(),
            ).not.toBe('Invalid Date');
            expect(parsedResponse.data.metadata).toBeDefined();
        });

        it('Ok response, offset=0, limit=3, orderBy=id, sortBy=desc', async () => {
            const server: App = new App(mockServiceRotues);
            const response: any = await request(server.app).get(
                '/todo/?offset=0&limit=3&orderBy=id&sortBy=desc',
            );

            const parsedResponse = JSON.parse(response.text);

            expect(mockTodoService.countTodos.mock.calls).toEqual([[]]);
            expect(mockTodoService.getAllTodos.mock.calls.length).toBe(1);
            expect(mockTodoService.getAllTodos.mock.calls[0][0]).toBe('id');
            expect(mockTodoService.getAllTodos.mock.calls[0][1]).toBe('desc');
            expect(mockTodoService.getAllTodos.mock.calls[0][2].offset).toBe(0);
            expect(mockTodoService.getAllTodos.mock.calls[0][2].limit).toBe(3);

            expect(parsedResponse.status).toBe(200);
            expect(parsedResponse.statusText).toBe('Success');
            expect(parsedResponse.data.items.length).toBe(3);
        });

        it('Error, wrong column name', async () => {
            const server: App = new App(mockServiceRotues);
            const non_columnName = 'abc';
            const response: any = await request(server.app).get(
                `/todo/?orderBy=${non_columnName}`,
            );

            const parsedResponse = JSON.parse(response.text);

            expect(mockTodoService.getAllTodos.mock.calls[0][0]).toBe(
                non_columnName,
            );
            expect(parsedResponse.status).toBe(400);
            expect(parsedResponse.statusText).toBe('Bad request');
            expect(parsedResponse.data.error).toBe(
                `column "${non_columnName}" does not exist`,
            );
        });

        it('Error, wrong query param values', async () => {
            const server: App = new App(mockServiceRotues);
            const non_offset = 'a';
            const non_limit = 3.4;
            const non_sort = 'tasc';
            const response: any = await request(server.app).get(
                `/todo/?offset=${non_offset}&limit=${non_limit}&sortBy=${non_sort}`,
            );

            const parsedResponse = JSON.parse(response.text);

            expect(mockTodoService.countTodos.mock.calls).toEqual([]);
            expect(mockTodoService.getAllTodos.mock.calls).toEqual([]);
            expect(parsedResponse.status).toBe(400);
            expect(parsedResponse.statusText).toBe('Bad request');
            expect(parsedResponse.data.error).toStrictEqual([
                {
                    location: 'query',
                    param: 'offset',
                    value: `${non_offset}`,
                    message: 'Optional, must be an Integer. By default: 0',
                },
                {
                    location: 'query',
                    param: 'limit',
                    value: `${non_limit}`,
                    message: 'Optional, must be an Integer. By default: 10',
                },
                {
                    location: 'query',
                    param: 'sortBy',
                    value: `${non_sort}`,
                    message: 'Optional, must be asc or desc. By default: asc',
                },
            ]);
        });

        it('No content exeption', async () => {
            await pool.query(`DROP TABLE IF EXISTS ${mockTable}`);
            await pool.query(
                `CREATE TEMPORARY TABLE ${mockTable} (LIKE todo INCLUDING ALL)`,
            );

            const server: App = new App(mockServiceRotues);
            const response: any = await request(server.app).get('/todo');

            const parsedResponse = JSON.parse(response.text);

            expect(mockTodoService.countTodos.mock.calls).toEqual([[]]);
            expect(mockTodoService.getAllTodos.mock.calls.length).toBe(1);
            expect(parsedResponse.status).toBe(204);
            expect(parsedResponse.statusText).toBe('No content');
            expect(parsedResponse.data).toEqual({});
        });
    });
});
