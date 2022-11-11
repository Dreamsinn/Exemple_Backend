import { ParamsDictionary } from 'express-serve-static-core';
import { TablesName } from '../../domain/enums/TablesNameEnum';
import { PutResponseData } from '../../domain/interficies/response/ResponseData';
import { UseCase } from '../../domain/interficies/UseCase';
import { PutTodoByIdBody } from '../../domain/schemas';
import { TodoService } from '../../infraestructure/services/todoService';

export class UpdateTodoById extends UseCase {
    private todoService: TodoService;

    constructor(service: TodoService) {
        super();
        this.todoService = service;
    }

    public async call(
        body: PutTodoByIdBody,
        params: ParamsDictionary,
    ): Promise<PutResponseData> {
        const { description } = body;
        const id: string = params.id;
        await this.todoService.updateTodoById(description, id);

        return { table: TablesName.TODO, id };
    }
}
