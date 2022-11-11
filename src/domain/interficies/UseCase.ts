import { ParamsDictionary } from 'express-serve-static-core';
import QueryString from 'qs';

export abstract class UseCase {
    abstract call(
        body?: any,
        query?: QueryString.ParsedQs,
        params?: ParamsDictionary,
    ): any;
}
