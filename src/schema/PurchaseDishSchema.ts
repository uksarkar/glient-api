import { FastifySchema } from "fastify";

const purchaseData: FastifySchema = {
  summary: "Purchase a dish for the user.",
  description:
    "This request will make a transaction based on the user id and restaurant id. We need the dish id to identify the dish and make sure that the dish id has relationship with the restaurant. e.g. take the dish id from the restaurants list. It'll take care of the user balance with appropriate error handling.",
  tags: ["Dish"],
  body: {
    type: "object",
    properties: {
      dishId: { type: "number", description: "Provide valid dish id" },
      restaurantId: {
        type: "number",
        description: "Provide valid restaurant id"
      },
      userId: {
        type: "number",
        description: "User id that exist on the database."
      }
    },
    required: ["dishId", "restaurantId", "userId"]
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: {
          type: "string",
          default: "SUCCESS"
        },
        tnx: {
          type: "object",
          properties: {
            id: { type: "number", default: 10 },
            restaurantId: { type: "number", default: 50 },
            dishId: { type: "number", default: 3 },
            purchaseAmount: { type: "number", default: 10.57 },
            purchaseDate: { type: "string", default: new Date() }
          }
        }
      }
    },
    404: {
      type: "object",
      properties: {
        statusCode: {
          type: "number",
          default: 404
        },
        error: {
          type: "string",
          default: "Invalid data bounding."
        },
        message: {
          type: "string",
          default: "The restaurant with this dish not found"
        }
      }
    },
    422: {
      type: "object",
      properties: {
        statusCode: {
          type: "number",
          default: 422
        },
        error: {
          type: "string",
          default: "Unprocessable data combination."
        },
        message: {
          type: "string",
          default: "Insufficient cash balance."
        }
      }
    },
    500: { $ref: "serverError500#" }
  }
};

export interface IPurchaseDishSchema {
  Body: {
    dishId: number;
    userId: number;
    restaurantId: number;
  };
}

export default purchaseData;
