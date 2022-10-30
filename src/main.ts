/** @format */

import express, { Request, Response } from 'express';
import { RouteMethod } from './domain/enums/RouteMethodEnum';
import { Route } from './domain/interficies/Route';
import RequestHandler from './handler';
import { routes } from './routes';
import dotenv from 'dotenv';

dotenv.config();

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.app.use(express.json());

        this.setRoute();
    }

    public create() {
        const port = process.env.SERVER_PORT;

        this.app.listen(port, () => {
            console.log(`Server is lisening localhost:${port}`);
            console.log(routes);
        });
    }

    private setRoute() {
        const getRequest = (route: Route) => {
            this.app.get(
                route.endpoint,
                route.middlewares,
                async (req: Request, res: Response) => {
                    console.log('GET', req.path);
                    console.log('Query params =', req.query);
                    console.log('Path params =', req.params);

                    const response = await new RequestHandler(
                        route,
                        req,
                    ).call();
                    res.send(response);
                    // res.json(response)
                },
            );
        };

        const putRequest = (route: Route) => {
            this.app.put(
                route.endpoint,
                route.middlewares,
                async (req: Request, res: Response) => {
                    console.log('PUT', req.path);
                    console.log('Query params =', req.query);
                    console.log('Path params =', req.params);
                    console.log('Put body =', req.body);

                    const response = await new RequestHandler(
                        route,
                        req,
                    ).call();
                    res.send(response);
                },
            );
        };

        const postRequest = (route: Route) => {
            this.app.post(
                route.endpoint,
                route.middlewares,
                async (req: Request, res: Response) => {
                    console.log('POST', req.path);
                    console.log('Query params =', req.query);
                    console.log('Path params =', req.params);
                    console.log('Poost body =', req.body);

                    const response = await new RequestHandler(
                        route,
                        req,
                    ).call();
                    res.send(response);
                },
            );
        };

        const deleteRequest = (route: Route) => {
            this.app.delete(
                route.endpoint,
                route.middlewares,
                async (req: Request, res: Response) => {
                    console.log('DELETE', req.path);
                    console.log('Query params =', req.query);
                    console.log('Path params =', req.params);

                    const response = await new RequestHandler(
                        route,
                        req,
                    ).call();
                    res.send(response);
                },
            );
        };

        routes.forEach((route: Route) => {
            switch (route.method) {
                case RouteMethod.GET:
                    getRequest(route);
                    break;

                case RouteMethod.PUT:
                    putRequest(route);
                    break;

                case RouteMethod.POST:
                    postRequest(route);
                    break;

                case RouteMethod.DELETE:
                    deleteRequest(route);
                    break;

                default:
                    console.log('Error: invalid route method');
                    break;
            }
        });
    }
}

const server = new App();
server.create();

// server.app.post("/todo", async(req, res) => {
//     try {
//         const {description} = req.body;
//         const newTodo = await pool.query('INSERT INTO todo (description) VALUES ($1) RETURNING *', [description]);

//         res.json(newTodo.rows[0])
//         console.log(newTodo.rows[0])
//     } catch (err) {
//         console.error(err)
//     }
// })

// server.app.get("/todo", async(req, res)=>{
//     try {
//     const allTodos = await pool.query("SELECT * FROM todo")

//     res.json(allTodos.rows)

//     } catch (err) {
//         console.error(err)
//     }
// })

// server.app.get("/todo/:id", async(req, res)=>{
//     try {
//         // lo que se ponga en la ruta (:id) sera la clave del objeto, si :cosa y se busca cotche te vendra un objeto con, {cosa: cocthe}
//         const {id} = req.params

//         const todo = await pool.query("SELECT * FROM todo WHERE id = $1", [id])

//         res.json(todo.rows[0])

//     } catch (err) {
//         console.error(err)
//     }
// })

// server.app.put("/todo/:id", async(req, res)=>{
//     try {
//         const {id} = req.params // WHERE

//         const {description} = req.body // SET

//         const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE id = $2", [description, id])

//         res.json('Todo was updated')

//     } catch (err) {
//         console.error(err)
//     }
// })

// server.app.delete("/todo/:id", async(req, res)=>{
//     try {
//         const {id} = req.params // WHERE

//         const deleteTodo = await pool.query("DELETE FROM todo WHERE id = $1", [id])

//         res.json('Todo was susccesfully deleted')

//     } catch (err) {
//         console.error(err)
//     }
// })
