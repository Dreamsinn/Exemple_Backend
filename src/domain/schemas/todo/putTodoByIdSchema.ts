import { JSONSchemaType } from 'ajv';

interface PutTodoyById {
    description: string;
}

export const putTodoByIdSchema: JSONSchemaType<PutTodoyById> = {
    type: 'object',

    properties: {
        description: { type: 'string' },
    },

    required: ['description'],
    additionalProperties: false,
};
