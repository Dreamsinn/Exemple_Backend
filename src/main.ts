import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import { RouteMethod } from './domain/enums/RouteMethodEnum';
import { Route } from './domain/interficies/Route';
import { DeleteHandler, GetHandler, PostHandler, PutHandler } from './handler';
import { routes } from './routes';
import rateLimit from 'express-rate-limit';

export class App {
    public app: express.Application;
    private routes: Route[];

    constructor(routes: Route[]) {
        this.app = express();
        this.app.use(express.json());

        const limiter = rateLimit({
            windowMs: 60 * 1000, // 1 minute
            max: 30, // limit 30 request each IP in windowMS
        });
        this.app.use(limiter);

        this.routes = routes;

        this.setRoute();
    }

    public create() {
        const port = process.env.SERVER_PORT;

        this.app.listen(port, () => {
            console.log(`Server is lisening localhost:${port}`);
            console.log(this.routes);
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

                    const response = await new GetHandler(route, req).call();
                    res.send(response);
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

                    const response = await new PutHandler(route, req).call();
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

                    const response = await new PostHandler(route, req).call();
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

                    const response = await new DeleteHandler(route, req).call();
                    res.send(response);
                },
            );
        };

        this.routes.forEach((route: Route) => {
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

new App(routes).create();
