import { JSONSchemaType } from 'ajv';

export interface PutTodoByIdBody {
    description: string;
}

export const putTodoByIdSchema: JSONSchemaType<PutTodoByIdBody> = {
    type: 'object',

    properties: {
        description: { type: 'string' },
    },

    required: ['description'],
    additionalProperties: false,
};
