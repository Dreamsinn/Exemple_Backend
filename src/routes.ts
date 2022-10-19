import TodoController from "./controllers/todo.Controller";
import { Route } from "./domain/interficies/Route";

const todoController = new TodoController()

export const routes: Route[] = [
    ...todoController.routes,
]

