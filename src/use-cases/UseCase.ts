import { UseCaseData } from '../domain/interficies/UseCaseData';

export abstract class UseCase {
    abstract call({ body, query, params }: UseCaseData<any>): Promise<any>;
}
