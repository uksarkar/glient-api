import { FastifySchema } from "fastify";

const search: FastifySchema = {
  querystring: {
    q: {
      type: "string",
      description: "Provide the corresponding model's property name."
    },
    limit: {
      type: "number",
      default: 20,
      description: "Data limit per page."
    },
    page: {
      type: "number",
      default: 1,
      description: "Page number, `total row`/`limit`."
    }
  }
};

export interface ISearchQuery {
  Querystring: {
    q?: string;
    limit?: number;
    page?: number;
  };
}

export default search;
