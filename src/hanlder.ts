import { Route } from "./domain/interficies/Route";
import { Request } from 'express'
import { GeneralErrorResponse } from "./infraestructure/response/response";
import { InternalServerException, InvalidBodyException } from "./infraestructure/response/errors";
import Ajv from "ajv"


export default class RequestHandler{
    private route: Route;
    private req: Request;
    private pool: any;

    constructor(route: Route, req: Request, pool: any){
        this.route = route,
        this.req = req,
        this.pool = pool
    }

    public async call(){
        if(this.route.schema){
            return this.bodyValitation()
        }

        try {
            const response = await this.route.handler.call(this.req, this.pool)
            return response;
        } catch (err: any) {
            const response = new GeneralErrorResponse(
                new InternalServerException(
                    `Internal server error: ${err.errors}`
                ),
            ).create()
        }
    }

    private bodyValitation(){
        const ajv = new Ajv({ allErrors: true })

        const validate = ajv.compile(this.route.schema)

        const valid = validate(this.req.body)

        if(!valid){
            let message = '';

            validate.errors?.forEach((error) => {
                const paramError = Object.entries(error.params)[0]
                const paramErrorKey = paramError[0].charAt(0).toUpperCase() + paramError[0].slice(1)
                const paramErrorValue = paramError[1]

                message += ` ${paramErrorKey}:'${paramErrorValue}', ${error.message}.`
            })

            return new GeneralErrorResponse(
                new InvalidBodyException(
                    `Invalid request body:${message}`
                ),
            ).create()
        }
    }
}
