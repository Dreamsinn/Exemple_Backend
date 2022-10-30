import { param } from 'express-validator';

export const selectByIdMiddleware = [param('id').isFloat()];
