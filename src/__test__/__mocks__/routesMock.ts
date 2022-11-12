import { RouteMethod } from '../../domain/enums/RouteMethodEnum';
import { Route } from '../../domain/interficies/Route';
import {
    getTodoByIdMiddleware,
    paginationMiddleware,
    selectByIdMiddleware,
} from '../../domain/middlewares';
import { postTodoSchema, putTodoByIdSchema } from '../../domain/schemas';
import {
    CreateTodo,
    DeleteTodoById,
    GetAllTodos,
    GetTodoById,
    UpdateTodoById,
} from '../../use-cases';
import { TodoService } from '../../infraestructure/services/todoService';

export function mockTodoRoute(service: TodoService) {
    const todoRoutes: Route[] = [
        {
            endpoint: '/todo',
            method: RouteMethod.GET,
            handler: new GetAllTodos(service),
            middlewares: paginationMiddleware,
        },
        {
            endpoint: '/todo/:id',
            method: RouteMethod.GET,
            handler: new GetTodoById(service),
            middlewares: getTodoByIdMiddleware,
        },
        {
            endpoint: '/todo',
            method: RouteMethod.POST,
            handler: new CreateTodo(service),
            middlewares: [],
            schema: postTodoSchema,
        },
        {
            endpoint: '/todo/:id',
            method: RouteMethod.PUT,
            handler: new UpdateTodoById(service),
            schema: putTodoByIdSchema,
            middlewares: selectByIdMiddleware,
        },
        {
            endpoint: '/todo/:id',
            method: RouteMethod.DELETE,
            handler: new DeleteTodoById(service),
            middlewares: selectByIdMiddleware,
        },
    ];

    return todoRoutes;
}
