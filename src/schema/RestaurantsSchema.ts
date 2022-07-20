import { FastifySchema } from "fastify";
import search from "./SearchSchema";

const restaurantResponse: FastifySchema["response"] = {
  200: {
    type: "array",
    items: {
      type: "object",
      properties: {
        restaurantName: { type: "string" },
        cashBalance: { type: "number" },
        restaurantTimes: { $ref: "restaurantTimes#" },
        restaurantDishes: { $ref: "restaurantDishesWithDish#" }
      }
    }
  },
  400: {
    statusCode: { type: "number", default: 400 },
    message: { type: "string" },
    error: { type: "string", default: "Invalid input data." }
  },
  500: { $ref: "serverError500#" }
};

const index: FastifySchema = {
  summary: "List restaurants by opening date range",
  description:
    "Provide valid date that can instantiate by `Javascript` `Date` class.",
  tags: ["Restaurants"],
  querystring: {
    open_at: {
      type: "string"
    },
    close_at: {
      type: "string"
    },
    limit: {
      type: "number",
      default: 20
    },
    page: {
      type: "number",
      default: 1
    }
  },
  response: restaurantResponse
};

const byDishes: FastifySchema = {
  summary: "List restaurants by dish count with price range.",
  description:
    "All values are optional, mix value as the query's need. The backend will take care of it.",
  tags: ["Restaurants"],
  querystring: {
    max_dishes: {
      type: "number"
    },
    min_dishes: {
      type: "number"
    },
    max_price: {
      type: "number"
    },
    min_price: {
      type: "number"
    },
    limit: {
      type: "number",
      default: 20
    },
    page: {
      type: "number",
      default: 1
    }
  },
  response: restaurantResponse
};

const restaurantSearch: FastifySchema = {
  ...search,
  tags: ["Restaurants"],
  summary: "Search restaurants by name.",
  description:
    "Search restaurants by it's name. Technically it's using full text search of `Pgsql`.",
  response: {
    200: {
      type: "array",
      items: { $ref: "restaurantSchema#" }
    },
    500: { $ref: "serverError500#" }
  }
};

export interface IRestaurantsIndexRequest {
  Querystring: {
    open_at?: string;
    close_at?: string;
    limit?: number;
    page?: number;
  };
}

export interface IRestaurantsByDishes {
  Querystring: {
    max_dishes?: number;
    min_dishes?: number;
    max_price?: number;
    min_price?: number;
    limit?: number;
    page?: number;
  };
}

export default { index, byDishes, restaurantSearch };
