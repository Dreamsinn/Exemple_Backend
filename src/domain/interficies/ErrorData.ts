/** @format */

import { ErrorLocation } from '../enums/ErrorLocationEnum';

export interface ErrorData {
    location: ErrorLocation;
    param: string;
    value: string;
    message: string;
}
