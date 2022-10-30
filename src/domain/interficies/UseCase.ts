import { Request } from 'express';

export abstract class UseCase {
    abstract call(req: Request): any;
}
