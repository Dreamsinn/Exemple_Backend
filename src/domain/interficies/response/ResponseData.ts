import { PaginationMetadata } from '../paginationData';
import { TablesName } from '../../enums/TablesNameEnum';

export interface GetResponseData<T> {
    items: T;
    metadata?: PaginationMetadata;
}

export interface PutResponseData {
    table: TablesName;
    id: string;
}

export interface PostResponseData<T> {
    items: T;
    table: TablesName;
}

export interface DeleteResponseData {
    table: TablesName;
}
