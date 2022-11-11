import { TablesName } from '../../domain/enums/TablesNameEnum';
import { PutResponseData } from '../../domain/interficies/response/ResponseData';
import { UseCase } from '../UseCase';
import { PutTodoByIdBody } from '../../domain/schemas';
import { TodoService } from '../../infraestructure/services/todoService';
import { UseCaseData } from '../../domain/interficies/UseCaseData';

export class UpdateTodoById extends UseCase {
    private todoService: TodoService;

    constructor(service: TodoService) {
        super();
        this.todoService = service;
    }

    public async call({
        params,
        body,
        ...props
    }: UseCaseData<PutTodoByIdBody>): Promise<PutResponseData> {
        const { description } = body;
        const id: string = params.id;
        await this.todoService.updateTodoById(description, id);

        return { table: TablesName.TODO, id };
    }
}
