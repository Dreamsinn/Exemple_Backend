import { JSONSchemaType } from 'ajv';

export interface PostTodoBody {
    description: string;
}

export const postTodoSchema: JSONSchemaType<PostTodoBody> = {
    type: 'object',

    properties: {
        description: { type: 'string' },
    },

    required: ['description'],
    additionalProperties: false,
};
