import { RouteMethod } from './domain/enums/RouteMethodEnum';
import { Route } from './domain/interficies/Route';
import {
    selectByIdMiddleware,
    getTodoByIdMiddleware,
} from './domain/middlewares/';
import { GetAllTodos, GetTodoById } from './use-cases';
import { postTodoByIdSchema } from './domain/schemas';

const todoRoutes: Route[] = [
    {
        endpoint: '/todo',
        method: RouteMethod.GET,
        handler: new GetAllTodos(),
        middlewares: [],
    },
    {
        endpoint: '/todo/:id',
        method: RouteMethod.GET,
        handler: new GetTodoById(),
        middlewares: getTodoByIdMiddleware,
    },
    {
        endpoint: '/todo',
        method: RouteMethod.POST,
        handler: new GetTodoById(),
        middlewares: [],
    },
    {
        endpoint: '/todo',
        method: RouteMethod.POST,
        handler: new GetTodoById(),
        middlewares: [],
    },
    {
        endpoint: '/todo/:id',
        method: RouteMethod.PUT,
        handler: new GetTodoById(),
        schema: postTodoByIdSchema,
        middlewares: selectByIdMiddleware,
    },
    {
        endpoint: '/todo/:id',
        method: RouteMethod.DELETE,
        handler: new GetTodoById(),
        middlewares: selectByIdMiddleware,
    },
];

export const routes: Route[] = [...todoRoutes];
