import { FastifySchema } from "fastify";
import search from "./SearchSchema";

const dishSearch: FastifySchema = {
  ...search,
  tags: ["Dish"],
  summary: "Search dish by name.",
  description:
    "Search dish by it's name. Technically it's using full text search of `Pgsql`.",
  response: {
    200: {
      type: "array",
      allOf: [
        {
          $ref: "restaurantDishesWithDish#"
        },
        {
          type: "array",
          items: {
            type: "object",
            properties: {
              restaurant: {
                type: "object",
                allOf: [
                  { $ref: "restaurantSchema#" },
                  {
                    type: "object",
                    properties: {
                      restaurantTimes: { $ref: "restaurantTimes#" }
                    }
                  }
                ]
              }
            }
          }
        }
      ]
    },
    500: { $ref: "serverError500#" }
  }
};

export default dishSearch;
