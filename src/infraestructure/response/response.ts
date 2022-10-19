import { APIrespopnse } from "../../domain/interficies/APIresponse";

export class BaseResponse{
    private readonly statusCode: number;
    private readonly bodObject: object;

    constructor(statusCode: number, bodObject: object){
        this.statusCode = statusCode;
        this.bodObject = bodObject;
    }

    public create(): APIrespopnse{
        const response = {
            statusCode: this.statusCode,
            body: this.bodObject
        }

        console.log({response})

        return response;
    }
}

export class GeneralErrorResponse extends BaseResponse{
    constructor(error: any){
        super(
            error.statusCode ??= 500,
            {
                message: error.message,
                result: 'Failure'
            }
        )
    }
}