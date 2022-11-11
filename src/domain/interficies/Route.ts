import { AnySchema } from 'ajv';
import { ValidationChain } from 'express-validator';
import { RouteMethod } from '../enums/RouteMethodEnum';
import { UseCase } from '../../use-cases';

export interface Route {
    method: RouteMethod;
    endpoint: string;
    handler: UseCase;
    schema?: AnySchema;
    middlewares: ValidationChain[];
}
