export abstract class BaseError extends Error{
    public statusCode: number = 500;
    public statusText: string = 'Error';

    constructor(message: string){
        super(message);
    }
}

export class InternalServerException extends BaseError{
    constructor(message?: string){
        super(message ??= 'Internal server error');

        this.statusText = 'Internal server error';
        this.statusCode = 500;
    }
}

export class InvalidBodyException extends BaseError{
    constructor(message?: string){
        super(message ??= 'Invalid request body');

        this.statusText = 'Invalid request body';
        this.statusCode = 400;
    }
}