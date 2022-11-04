import { Request } from 'express';
import { UseCase } from '../../domain/interficies/UseCase';
import { db } from '../../main';

export class GetTodoById extends UseCase {
    public async call({ params, ...req }: Request) {
        const id: string = params.id;

        const idsList = id.split(',');

        const queryVariables = this.createqueryVariables(idsList);

        const response = await db.query(
            `SELECT * FROM todo WHERE id IN (${queryVariables})`,
            idsList,
        );

        return response;
    }

    private createqueryVariables(idsList: string[]): string {
        let queryString = '';

        for (let i = 1; idsList.length > i - 1; i++) {
            queryString += `$` + i + ', ';
        }

        return queryString.slice(0, -2);
    }
}
