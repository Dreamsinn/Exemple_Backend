import { Route } from './domain/interficies/Route';
import { Request } from 'express';
import {
    DeleteResponse,
    GeneralErrorResponse,
    GetResponse,
    PostResponse,
    PutResponse,
} from './infraestructure/response/response';
import {
    InternalServerException,
    InvalidRequestException,
} from './infraestructure/response/errors';
import Ajv, { AnySchema } from 'ajv';
import { validationResult } from 'express-validator';
import { ErrorData } from './domain/interficies/response/ErrorData';
import { ErrorLocation } from './domain/enums/ErrorLocationEnum';
import { APIrespopnse } from './domain/interficies/response/APIresponse';
import { UseCase } from './domain/interficies/UseCase';

export default class Handler {
    private route: Route;
    private request: Request;

    constructor(route: Route, request: Request) {
        this.route = route;
        this.request = request;
    }

    public async call(): Promise<APIrespopnse> {
        const { error, requestErrors } = this.requestValidations();

        if (error) {
            return new GeneralErrorResponse(
                new InvalidRequestException(requestErrors),
            ).create();
        }

        try {
            return this.createResponse();
        } catch (err: any) {
            return new GeneralErrorResponse(
                new InternalServerException(`${err.mensaje}`),
            ).create();
        }
    }

    private requestValidations() {
        let requestErrors: ErrorData[] = [];

        if (this.route.middlewares.length) {
            requestErrors = this.queryAndParamsValidation(requestErrors);
        }

        if (this.route.schema) {
            const schema: AnySchema = this.route.schema;
            requestErrors = this.bodyValitation(requestErrors, schema);
        }

        return {
            error: requestErrors.length,
            requestErrors,
        };
    }

    private queryAndParamsValidation(requestErrors: ErrorData[]) {
        const errors = validationResult(this.request);

        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                requestErrors.push({
                    location:
                        error.location === ErrorLocation.PARAMS
                            ? ErrorLocation.PARAMS
                            : ErrorLocation.QUERY,
                    param: error.param,
                    value: error.value,
                    message: error.msg,
                });
            });
        }

        return requestErrors;
    }

    private bodyValitation(requestErrors: ErrorData[], schema: AnySchema) {
        const ajv = new Ajv({ allErrors: true });

        const validate = ajv.compile(schema);

        const valid = validate(this.request.body);

        if (!valid) {
            validate.errors?.forEach((error) => {
                const paramError = Object.entries(error.params)[0];
                const paramErrorKey =
                    paramError[0].charAt(0).toUpperCase() +
                    paramError[0].slice(1);
                const paramErrorValue = paramError[1];

                let param = paramErrorValue;

                if (error.instancePath !== '') {
                    param = error.instancePath.slice(1);
                }

                requestErrors.push({
                    location: ErrorLocation.BODY,
                    param: param,
                    value: this.request.body[param],
                    message: paramErrorKey + ': ' + error.message + '.',
                });
            });
        }

        return requestErrors;
    }

    private createResponse(): Promise<APIrespopnse> {
        type Dictionary = {
            [key: string]: (
                handler: UseCase,
                request: Request,
            ) => Promise<APIrespopnse>;
        };
        const methodDictionary: Dictionary = {
            GET: this.getRequest,
            POST: this.postRequest,
            PUT: this.putRequest,
            DELETE: this.deleteRequest,
        };

        const methodRequest = methodDictionary[this.route.method];

        return methodRequest(this.route.handler, this.request);
    }

    private async getRequest(
        handler: UseCase,
        request: Request,
    ): Promise<APIrespopnse> {
        const useCase = await handler.call(request);
        return new GetResponse(useCase).create();
    }

    private async postRequest(
        handler: UseCase,
        request: Request,
    ): Promise<APIrespopnse> {
        const useCase = await handler.call(request);
        return new PostResponse(useCase).create();
    }

    private async putRequest(
        handler: UseCase,
        request: Request,
    ): Promise<APIrespopnse> {
        const useCase = await handler.call(request);
        return new PutResponse(useCase).create();
    }

    private async deleteRequest(
        handler: UseCase,
        request: Request,
    ): Promise<APIrespopnse> {
        const useCase = await handler.call(request);
        return new DeleteResponse(useCase).create();
    }
}
