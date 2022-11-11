import { TablesName } from '../../domain/enums/TablesNameEnum';
import { DeleteResponseData } from '../../domain/interficies/response/ResponseData';
import { UseCase } from '../UseCase';
import { TodoService } from '../../infraestructure/services/todoService';
import { UseCaseData } from '../../domain/interficies/UseCaseData';

export class DeleteTodoById extends UseCase {
    private todoService: TodoService;

    constructor(service: TodoService) {
        super();
        this.todoService = service;
    }

    public async call({
        params,
        ...props
    }: UseCaseData<any>): Promise<DeleteResponseData> {
        const id: string = params.id;
        await this.todoService.deleteTodoById(id);

        return { table: TablesName.TODO };
    }
}
