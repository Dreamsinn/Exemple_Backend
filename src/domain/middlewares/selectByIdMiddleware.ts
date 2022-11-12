import { param } from 'express-validator';

export const selectByIdMiddleware = [param('id', 'Must be an uuid').isUUID()];
