import fp from "fastify-plugin";
import fastifySwagger, { SwaggerOptions } from "@fastify/swagger";

export default fp<SwaggerOptions>(async (fastify, _) => {
  fastify.register(fastifySwagger, {
    routePrefix: "/docs",
    exposeRoute: true,
    swagger: {
      info: {
        title: "Glient - API Documentations",
        description: "Test the API",
        version: "0.0.1"
      }
    }
  });
});
