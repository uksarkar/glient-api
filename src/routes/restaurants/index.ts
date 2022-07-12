import { FastifyPluginAsync } from "fastify";

const restaurants: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return [];
  });
};

export default restaurants;
