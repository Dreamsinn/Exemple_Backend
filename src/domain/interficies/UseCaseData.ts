import QueryString from 'qs';
import { ParamsDictionary } from 'express-serve-static-core';

export interface UseCaseData<T> {
    body: T;
    params: ParamsDictionary;
    query: QueryString.ParsedQs;
}
