import { RouteMethod } from './domain/enums/RouteMethodEnum';
import { Route } from './domain/interficies/Route';
import {
    selectByIdMiddleware,
    getTodoByIdMiddleware,
    paginationMiddleware,
} from './domain/middlewares/';
import { GetAllTodos, GetTodoById } from './use-cases';
import { postTodoSchema, putTodoByIdSchema } from './domain/schemas';
import { TodoService } from './infraestructure/services/todoService';
import { CreateTodo } from './use-cases/todo/createTodo';
import { UpdateTodoById } from './use-cases/todo/updateTodoById';

const todoService = new TodoService();
const todoRoutes: Route[] = [
    {
        endpoint: '/todo',
        method: RouteMethod.GET,
        handler: new GetAllTodos(todoService),
        middlewares: paginationMiddleware,
    },
    {
        endpoint: '/todo/:id',
        method: RouteMethod.GET,
        handler: new GetTodoById(todoService),
        middlewares: getTodoByIdMiddleware,
    },
    {
        endpoint: '/todo',
        method: RouteMethod.POST,
        handler: new CreateTodo(todoService),
        middlewares: [],
        schema: postTodoSchema,
    },
    {
        endpoint: '/todo/:id',
        method: RouteMethod.PUT,
        handler: new UpdateTodoById(todoService),
        schema: putTodoByIdSchema,
        middlewares: selectByIdMiddleware,
    },
    {
        endpoint: '/todo/:id',
        method: RouteMethod.DELETE,
        handler: new GetTodoById(todoService),
        middlewares: selectByIdMiddleware,
    },
];

export const routes: Route[] = [...todoRoutes];
