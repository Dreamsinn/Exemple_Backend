import { APIrespopnse } from '../../domain/interficies/response/APIresponse';
import {
    DeleteResponseData,
    GetResponseData,
    PostResponseData,
    PutResponseData,
} from '../../domain/interficies/response/ResponseData';

export class BaseResponse {
    private readonly statusCode: number;
    private readonly statusText: string;
    private readonly dataObject: object;

    constructor(statusCode: number, statusText: string, dataObject: object) {
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.dataObject = dataObject;
    }

    public create(): APIrespopnse {
        const response = {
            status: this.statusCode,
            statusText: this.statusText,
            data: this.dataObject,
        };

        console.log({ response });

        return response;
    }
}

export class GeneralErrorResponse extends BaseResponse {
    constructor(error: any) {
        super((error.statusCode ??= 500), (error.statusText ??= 'Error'), {
            error: error.bodyError,
        });
    }
}

export class NoContentResponse extends BaseResponse {
    constructor(message?: string) {
        super(204, message ?? 'No Content', {});
    }
}

export class GetResponse extends BaseResponse {
    constructor(data: GetResponseData<object>) {
        if (data.metadata) {
            super(200, 'Sucess', data);
        } else {
            super(200, 'Sucess', data.items);
        }
    }
}

export class PostResponse extends BaseResponse {
    constructor({ table, items }: PostResponseData<object>) {
        super(201, `${table} created successfully`, items);
    }
}

export class PutResponse extends BaseResponse {
    constructor({ table, id }: PutResponseData) {
        super(200, `${table} updated successfully`, { id });
    }
}

export class DeleteResponse extends NoContentResponse {
    constructor({ table }: DeleteResponseData) {
        super(`${table} deleted successfully`);
    }
}
