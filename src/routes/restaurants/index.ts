import { FastifyPluginAsync, FastifyRequest } from "fastify";
import RestaurantsSchema, {
  IRestaurantsIndexRequest
} from "../../schema/RestaurantsSchema";

const restaurants: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get(
    "/",
    {
      schema: RestaurantsSchema.index
    },
    async function (request: FastifyRequest<IRestaurantsIndexRequest>, reply) {
      console.log(typeof request.query.max_dishes);
      return [];
    }
  );
};

export default restaurants;
