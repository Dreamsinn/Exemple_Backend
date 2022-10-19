import { Controller } from "../domain/interficies/Controllers"
import { RouteMethod } from "../domain/interficies/RouteMethodEnum";
import { Route } from "../domain/interficies/Route";
import GetAllTodos from "../use-cases/todo/getAllTodos";
import GetTodoById from "../use-cases/todo/getTodoById";
import { postTodoByIdSchema } from "../domain/schemas/todo/postTodoByIdSchema";

export default class TodoController {
    private controllerEndpoint: string ;

    public routes: Route[] = [];

    constructor(){
        this.controllerEndpoint = '/todo' 

        this.getAllTodos();
        this.getTodoById();
        this.createTodo();
        this.updateTodoByid();
        this.deleteTodoByid();
    }

    private getAllTodos(){
        const route: Route = {
            endpoint: this.controllerEndpoint,
            method: RouteMethod.GET,
            handler: new GetAllTodos,
        }

        return this.routes.push(route)
    }

    private getTodoById(){
        const route: Route = {
            endpoint: this.controllerEndpoint + '/:id',
            method: RouteMethod.GET,
            handler: new GetTodoById,
        }

        return this.routes.push(route)
    }

    private createTodo(){
        const route: Route = {
            endpoint: this.controllerEndpoint,
            method: RouteMethod.POST,
            handler: new GetTodoById,
        }

        return this.routes.push(route)
    }

    private updateTodoByid() {
        const route: Route = {
            endpoint: this.controllerEndpoint + '/:id',
            method: RouteMethod.PUT,
            handler: new GetTodoById,
            schema: postTodoByIdSchema
        }

        return this.routes.push(route)
    }

    private deleteTodoByid() {
        const route: Route = {
            endpoint: this.controllerEndpoint + '/:id',
            method: RouteMethod.DELETE,
            handler: new GetTodoById,
        }

        return this.routes.push(route)
    }
}