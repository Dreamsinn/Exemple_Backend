import { Request } from 'express';
import { TablesName } from '../../domain/enums/TablesNameEnum';
import { PutResponseData } from '../../domain/interficies/response/ResponseData';
import { UseCase } from '../../domain/interficies/UseCase';
import { TodoService } from '../../infraestructure/services/todoService';

export class UpdateTodoById extends UseCase {
    private todoService: TodoService;

    constructor(service: TodoService) {
        super();
        this.todoService = service;
    }

    public async call({ params, ...req }: Request): Promise<PutResponseData> {
        const { description } = req.body;
        const id: string = params.id;
        await this.todoService.updateTodoById(description, id);

        return { table: TablesName.TODO, id };
    }
}
