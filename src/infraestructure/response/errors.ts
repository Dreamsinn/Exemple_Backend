import { ErrorData } from '../../domain/interficies/response/ErrorData';

export abstract class BaseError {
    public statusCode = 500;
    public statusText = 'Error';
    public bodyError: string | ErrorData[];

    constructor(bodyError: string | ErrorData[]) {
        this.bodyError = bodyError;
    }
}

export class InvalidRequestException extends BaseError {
    constructor(bodyError?: string | ErrorData[]) {
        super((bodyError ??= 'Invalid request'));

        this.statusText = 'Bad request';
        this.statusCode = 400;
    }
}

export class NotFoundException extends BaseError {
    constructor(bodyError?: string | ErrorData[]) {
        super((bodyError ??= 'Requested resource could not be found'));

        this.statusText = 'Not found';
        this.statusCode = 404;
    }
}

export class InternalServerException extends BaseError {
    constructor(bodyError?: string) {
        super((bodyError ??= 'Internal server error'));

        this.statusText = 'Internal server error';
        this.statusCode = 500;
    }
}
