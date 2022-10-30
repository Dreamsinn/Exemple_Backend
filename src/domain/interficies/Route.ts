import { RouteMethod } from '../enums/RouteMethodEnum';

export interface Route {
    method: RouteMethod;
    endpoint: string;
    handler: any;
    schema?: any;
    middlewares: any;
}
