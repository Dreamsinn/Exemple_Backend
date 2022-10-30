import { Request } from 'express';
import { UseCase } from '../../domain/interficies/UseCase';

export class GetTodoById extends UseCase {
    public call(req: Request) {
        console.log('ejecucion');
    }
}
