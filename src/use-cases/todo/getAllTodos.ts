import { UseCase } from '../../domain/interficies/UseCase';
import { db } from '../../main';

export class GetAllTodos extends UseCase {
    public async call() {
        return await db.query('SELECT * FROM todo');
    }
}
