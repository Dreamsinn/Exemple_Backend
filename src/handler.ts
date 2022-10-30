import { Route } from "./domain/interficies/Route";
import { Request } from 'express'
import { GeneralErrorResponse } from "./infraestructure/response/response";
import { InternalServerException, InvalidRequestException } from "./infraestructure/response/errors";
import Ajv from "ajv"
import { validationResult } from "express-validator";
import { ErrorData } from "./domain/interficies/ErrorData";
import { ErrorLocation } from "./domain/enums/ErrorLocationEnum";


export default class RequestHandler{
    private route: Route;
    private request: Request

    constructor(route: Route, request: Request){
        this.route = route,
        this.request = request
    }

    public async call(){
        const {error, requestErrors} = this.requestValidations()

        if(error){
            return new GeneralErrorResponse(
                new InvalidRequestException(
                    requestErrors
                ),
            ).create()
        }
       
        try {
            return await this.route.handler.call(this.request)
        } catch (err: any) {
            return new GeneralErrorResponse(
                new InternalServerException(
                    `${err.mensaje}`
                ),
            ).create()
        }
    }

    private requestValidations(){
        let requestErrors: ErrorData[] = [];

        if(this.route.middlewares.length){
            requestErrors = this.queryAndParamsValidation(requestErrors);
        }

        if(this.route.schema){
            requestErrors = this.bodyValitation(requestErrors)
        }

       return {
            error: requestErrors.length,
            requestErrors,
       };
    }

    private queryAndParamsValidation(requestErrors: ErrorData[]){
        const errors = validationResult(this.request);

        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                requestErrors.push({
                    location: error.location === ErrorLocation.PARAMS ? ErrorLocation.PARAMS : ErrorLocation.QUERY,
                    param: error.param,
                    value: error.value,
                    message: error.msg
                })
            })
        }

        return requestErrors;
    }

    private bodyValitation(requestErrors: ErrorData[]){
        const ajv = new Ajv({ allErrors: true })

        const validate = ajv.compile(this.route.schema)

        const valid = validate(this.request.body)

        if(!valid){
            validate.errors?.forEach((error) => {
                const paramError = Object.entries(error.params)[0]
                const paramErrorKey = paramError[0].charAt(0).toUpperCase() + paramError[0].slice(1)
                const paramErrorValue = paramError[1]

                let param = paramErrorValue

                if( error.instancePath !== ''){
                    param = error.instancePath.slice(1)
                }

                requestErrors.push({
                    location: ErrorLocation.BODY,
                    param: param,
                    value: this.request.body[param],
                    message: paramErrorKey + ": " + error.message + '.'
                })
            })
        }

        return requestErrors;
    }
}
