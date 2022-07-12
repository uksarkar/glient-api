import { FastifySchema } from "fastify";

const index: FastifySchema = {
  description: "This route is responsible for listing restaurants.",
  tags: ["restaurants"],
  querystring: {
    open_at: {
      type: "string"
    },
    close_at: {
      type: "string"
    },
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
    name: {
      type: "string"
    }
  }
};

export interface IRestaurantsIndexRequest {
  Querystring: {
    open_at?: string;
    close_at?: string;
    max_dishes?: number;
    min_dishes?: number;
    max_price?: number;
    min_price?: number;
    name?: string;
  };
}

export default { index };
