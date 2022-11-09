import { Route } from './domain/interficies/Route';
import { Request } from 'express';
import {
    DeleteResponse,
    GeneralErrorResponse,
    GetResponse,
    PostResponse,
    PutResponse,
} from './infraestructure/response/response';
import { InvalidRequestException } from './infraestructure/response/errors';
import { APIrespopnse } from './domain/interficies/response/APIresponse';
import BaseHandler from './domain/interficies/BaseHandler';
import {
    DeleteResponseData,
    GetResponseData,
    PostResponseData,
    PutResponseData,
} from './domain/interficies/response/ResponseData';

export class GetHandler extends BaseHandler {
    constructor(route: Route, request: Request) {
        super(route, request);
    }

    public async call() {
        const { error, requestErrors } = this.requestValidations();

        if (error) {
            return new GeneralErrorResponse(
                new InvalidRequestException(requestErrors),
            ).create();
        }

        const useCase: GetResponseData<object | object[]> =
            await this.route.handler.call(this.request);
        return new GetResponse(useCase).create();
    }
}

export class PostHandler extends BaseHandler {
    constructor(route: Route, request: Request) {
        super(route, request);
    }

    public async call(): Promise<APIrespopnse> {
        const { error, requestErrors } = this.requestValidations();

        if (error) {
            return new GeneralErrorResponse(
                new InvalidRequestException(requestErrors),
            ).create();
        }

        const useCase: PostResponseData<object> = await this.route.handler.call(
            this.request,
        );
        return new PostResponse(useCase).create();
    }
}

export class PutHandler extends BaseHandler {
    constructor(route: Route, request: Request) {
        super(route, request);
    }

    public async call(): Promise<APIrespopnse> {
        const { error, requestErrors } = this.requestValidations();

        if (error) {
            return new GeneralErrorResponse(
                new InvalidRequestException(requestErrors),
            ).create();
        }

        const useCase: PutResponseData = await this.route.handler.call(
            this.request,
        );
        return new PutResponse(useCase).create();
    }
}

export class DeleteHandler extends BaseHandler {
    constructor(route: Route, request: Request) {
        super(route, request);
    }

    public async call(): Promise<APIrespopnse> {
        const { error, requestErrors } = this.requestValidations();

        if (error) {
            return new GeneralErrorResponse(
                new InvalidRequestException(requestErrors),
            ).create();
        }

        const useCase: DeleteResponseData = await this.route.handler.call(
            this.request,
        );
        return new DeleteResponse(useCase).create();
    }
}
