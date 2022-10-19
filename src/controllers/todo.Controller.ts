import { Controller } from "../domain/interficies/Controllers"
import { RouteMethod } from "../domain/enums/RouteMethodEnum";
import { Route } from "../domain/interficies/Route";
import GetAllTodos from "../use-cases/todo/getAllTodos";
import GetTodoById from "../use-cases/todo/getTodoById";
import { postTodoByIdSchema } from "../domain/schemas/todo/postTodoByIdSchema";
import { param, query } from 'express-validator'

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
            middlewares: []
        }

        return this.routes.push(route)
    }

    private getTodoById(){
        const middlewares = [
            param('id')
                .isFloat(),
            // query('color')              //para querys solo hace falta especificarlo en el midleware, no en la ruta
                // .custom(value=>{     //en customs retrun false = error inespecifico ; throw new Error('Must be defined') = error + mensaje de error
                //     if(value === undefined){
                //         throw new Error('Must be defined')
                //     }

                //     if(!isNaN(Number(value)) && value !== ''){
                //         throw new Error("Can't be a number")
                //     }
                   
                //     return true      // necesario, sino sin un caso sin error seimpre dara error
                // })
                // .optional()
                //  .notEmpty()
        ]

        const route: Route = {
            endpoint: this.controllerEndpoint + '/:id',
            method: RouteMethod.GET,
            handler: new GetTodoById,
            middlewares: middlewares
        }

        return this.routes.push(route)
    }

    private createTodo(){
        const route: Route = {
            endpoint: this.controllerEndpoint,
            method: RouteMethod.POST,
            handler: new GetTodoById,
            middlewares: []
        }

        return this.routes.push(route)
    }

    private updateTodoByid() {
        const middlewares = [
            param('id')
                .isFloat()
        ]

        const route: Route = {
            endpoint: this.controllerEndpoint + '/:id',
            method: RouteMethod.PUT,
            handler: new GetTodoById,
            schema: postTodoByIdSchema,
            middlewares: middlewares
        }

        return this.routes.push(route)
    }

    private deleteTodoByid() {
        const route: Route = {
            endpoint: this.controllerEndpoint + '/:id',
            method: RouteMethod.DELETE,
            handler: new GetTodoById,
            middlewares: []
        }

        return this.routes.push(route)
    }
}