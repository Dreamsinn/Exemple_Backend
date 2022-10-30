import { AnySchema } from 'ajv';
import { ValidationChain } from 'express-validator';
import { RouteMethod } from '../enums/RouteMethodEnum';
import { UseCase } from './UseCase';

export interface Route {
    method: RouteMethod;
    endpoint: string;
    handler: UseCase;
    schema?: AnySchema;
    middlewares: ValidationChain[];
}
