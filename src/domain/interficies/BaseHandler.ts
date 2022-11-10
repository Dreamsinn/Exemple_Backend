import { Request } from 'express';
import Ajv, { AnySchema } from 'ajv';
import { validationResult } from 'express-validator';
import { Route } from './Route';
import { ErrorData } from './response/ErrorData';
import { ErrorLocation } from '../enums/ErrorLocationEnum';
import {
    GeneralErrorResponse,
    NoContentResponse,
} from '../../infraestructure/response/response';
import {
    InternalServerException,
    InvalidRequestException,
    NotFoundException,
} from '../../infraestructure/response/errors';
import { APIrespopnse } from './response/APIresponse';
import { ErrorHandling } from '../enums/ErrorHandlingEnum';

export default abstract class BaseHandler {
    protected route: Route;
    protected request: Request;

    constructor(route: Route, request: Request) {
        this.route = route;
        this.request = request;
    }

    protected requestValidations() {
        let requestErrors: ErrorData[] = [];

        if (this.route.middlewares.length) {
            requestErrors = this.queryAndParamsValidation(requestErrors);
        }

        if (this.route.schema) {
            const schema: AnySchema = this.route.schema;
            requestErrors = this.bodyValitation(requestErrors, schema);
        }

        const requestHasBody = Object.keys(this.request.body).length;
        if (!this.route.schema && requestHasBody) {
            requestErrors.push({
                location: ErrorLocation.BODY,
                message: 'This endpoint does not admit bodies',
            });
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

    protected errorHandling(err: any): APIrespopnse {
        if (err.message === ErrorHandling.NOT_FOUND) {
            return new GeneralErrorResponse(new NotFoundException()).create();
        }

        if (err.message === ErrorHandling.NO_CONTENT) {
            return new NoContentResponse().create();
        }

        if (err.routine === 'errorMissingColumn') {
            return new GeneralErrorResponse(
                new InvalidRequestException(err.message),
            ).create();
        }

        return new GeneralErrorResponse(
            new InternalServerException(err.message),
        ).create();
    }
}
