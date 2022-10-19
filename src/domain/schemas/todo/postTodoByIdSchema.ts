import {JSONSchemaType} from "ajv"

interface PostTodoyById {
  description: string
}

export const postTodoByIdSchema: JSONSchemaType<PostTodoyById> = {
    type: "object",
  
    properties: {
      "description": { "type": "string" },
    },
  
    required: ["description"],
    additionalProperties: false
}