import { JSONSchemaType } from 'ajv';

interface PostTodoy {
    description: string;
}

export const postTodoSchema: JSONSchemaType<PostTodoy> = {
    type: 'object',

    properties: {
        description: { type: 'string' },
    },

    required: ['description'],
    additionalProperties: false,
};
