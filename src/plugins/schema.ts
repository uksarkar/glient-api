import fp from "fastify-plugin";

export default fp(async (fastify, _) => {
  // server error 500
  fastify.addSchema({
    $id: "serverError500",
    type: "object",
    properties: {
      statusCode: {
        type: "number",
        default: 500
      },
      error: {
        type: "string",
        default: "Internal Server Error"
      },
      message: {
        type: "string",
        default: "Something wrong happened."
      }
    }
  });

  // restaurant
  fastify.addSchema({
    $id: "restaurantSchema",
    type: "object",
    properties: {
      id: { type: "number" },
      restaurantName: { type: "string" },
      cashBalance: { type: "number" }
      //   restaurantTimes: { $ref: "restaurantTimes#" }
    }
  });

  // restaurantTimes
  fastify.addSchema({
    $id: "restaurantTimes",
    type: "array",
    items: {
      type: "object",
      properties: {
        openAt: {
          type: "string",
          default: `1970-01-01T00:00:00.000Z`,
          description:
            "For the proxy date, the restaurant `openAt` using first weak of `1970`."
        },
        closeAt: {
          type: "string",
          default: `1970-01-01T00:00:00.000Z`,
          description:
            "For the proxy date, the restaurant `closeAt` using first weak of `1970`."
        },
        restaurantId: { type: "number" }
      }
    }
  });

  // dish
  fastify.addSchema({
    $id: "dishSchema",
    type: "object",
    properties: {
      dishName: { type: "string" },
      id: { type: "number" }
    }
  });

  // restaurantDishes
  fastify.addSchema({
    $id: "restaurantDishes",
    type: "array",
    items: {
      type: "object",
      properties: {
        restaurantId: { type: "number" },
        dishId: { type: "number" }
      }
    }
  });

  // restaurantDish with relation data
  fastify.addSchema({
    $id: "restaurantDishesWithDish",
    type: "array",
    allOf: [
      {
        type: "array",
        items: {
          type: "object",
          properties: {
            dish: { $ref: "dishSchema#" }
          }
        }
      },
      {
        $ref: "restaurantDishes#"
      }
    ]
  });
});
