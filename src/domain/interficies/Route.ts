import { RouteMethod } from "../enums/RouteMethodEnum";
import { Pool } from 'pg';
import {Request} from 'express'

export interface Route {
    method: RouteMethod,
    endpoint: string,
    handler: any,
    schema?: any,
    middlewares: any,
}