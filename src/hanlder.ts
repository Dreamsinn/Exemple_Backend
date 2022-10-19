import { Route } from "./domain/interficies/Route";
import { Request } from 'express'
import { GeneralErrorResponse } from "./infraestructure/response/response";
import { InternalServerException, InvalidRequestException } from "./infraestructure/response/errors";
import Ajv from "ajv"
import { Result, validationResult } from "express-validator";
import { ErrorData } from "./domain/interficies/ErrorData";
import { ErrorLocation } from "./domain/enums/ErrorLocationEnum";


export default class RequestHandler{
    private route: Route;
    private req: Request;
    private middlewareValidatoin: Result;
    private pool: any;

    private bodyError: ErrorData[] = [];

    constructor(route: Route, req: Request, pool: any){
        this.route = route,
        this.req = req,
        this.middlewareValidatoin = validationResult(req);
        this.pool = pool
    }

    public async call(){
        if(this.route.middlewares.length > 0){
            this.queryAndParamsValidation();
        }

        if(this.route.schema){
            this.bodyValitation()
        }

        if(this.bodyError.length){
            return new GeneralErrorResponse(
                new InvalidRequestException(
                    this.bodyError
                ),
            ).create()
        }

        try {
            const response = await this.route.handler.call(this.req, this.pool)
            return response;
        } catch (err: any) {
            const response = new GeneralErrorResponse(
                new InternalServerException(
                    `${err.errors}`
                ),
            ).create()
        }
    }

    private bodyValitation(){
        const ajv = new Ajv({ allErrors: true })

        const validate = ajv.compile(this.route.schema)

        const valid = validate(this.req.body)

        if(!valid){
            validate.errors?.forEach((error) => {
                const paramError = Object.entries(error.params)[0]
                const paramErrorKey = paramError[0].charAt(0).toUpperCase() + paramError[0].slice(1)
                const paramErrorValue = paramError[1]

                let param = paramErrorValue

                if( error.instancePath !== ''){
                    param = error.instancePath.slice(1)
                }

                this.bodyError.push({
                    location: ErrorLocation.BODY,
                    param: param,
                    value: this.req.body[param],
                    message: paramErrorKey + ": " + error.message + '.'
                })
            })
        }
    }

    private queryAndParamsValidation(){
        const errors = this.middlewareValidatoin

        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                console.log(error)
                this.bodyError.push({
                    location: error.location === ErrorLocation.PARAMS ? ErrorLocation.PARAMS : ErrorLocation.QUERY,
                    param: error.param,
                    value: error.value,
                    message: error.msg
                })
            })
        }
    }
}
