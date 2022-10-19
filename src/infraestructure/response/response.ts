import { APIrespopnse } from "../../domain/interficies/APIresponse";

export class BaseResponse{
    private readonly statusCode: number;
    private readonly dataObject: object;
    private readonly statusText: string;


    constructor(statusCode: number, statusText: string, dataObject: object){
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.dataObject = dataObject;
    }

    public create(): APIrespopnse{
        const response = {
            status: this.statusCode,
            statusText: this.statusText,
            data: this.dataObject
        }

        console.log({response})

        return response;
    }
}

export class GeneralErrorResponse extends BaseResponse{
    constructor(error: any){
        super(
            error.statusCode ??= 500,
            error.statusText ??= 'Error',
            {
                error: error.message, 
            }
        )
    }
}