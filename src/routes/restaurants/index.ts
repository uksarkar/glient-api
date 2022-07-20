import { FastifyPluginAsync, FastifyRequest } from "fastify";
const escapeString = require("sql-string-escape");

import RestaurantsSchema, {
  IRestaurantsIndexRequest,
  IRestaurantsByDishes
} from "../../schema/RestaurantsSchema";
import { ISearchQuery } from "../../schema/SearchSchema";
import PaginationHelper from "../../utils/PaginationHelper";
import PrismaInstance from "../../utils/PrismaInstance";
import RestaurantTimeHelper from "../../utils/RestaurantTimeHelper";

const restaurants: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  /**
   *  @method GET
   *  @route  /restaurants
   *  @return {Restaurant[]}
   */
  fastify.get(
    "/",
    {
      schema: RestaurantsSchema.index
    },
    async function (request: FastifyRequest<IRestaurantsIndexRequest>, reply) {
      const queryData = request.query;
      const restaurant = PrismaInstance.restaurant;

      const pagination = new PaginationHelper(queryData.limit, queryData.page);
      const timeQuery: { openAt?: { gte: Date }; closeAt?: { lte: Date } } = {};

      if (queryData.open_at) {
        const openAt = new RestaurantTimeHelper(queryData.open_at);

        if (!openAt.isValid)
          throw { statusCode: 400, message: "Invalid date format." };

        timeQuery["openAt"] = { gte: openAt.date! };
      }

      if (queryData.close_at) {
        const closeAt = new RestaurantTimeHelper(queryData.close_at);

        if (!closeAt.isValid)
          throw { statusCode: 400, message: "Invalid date format." };

        timeQuery["closeAt"] = { lte: closeAt.date! };
      }

      return restaurant.findMany({
        where: {
          restaurantTimes:
            timeQuery.closeAt || timeQuery.closeAt
              ? {
                  some: timeQuery
                }
              : undefined
        },
        select: {
          restaurantDishes: {
            include: {
              dish: true
            }
          },
          restaurantName: true,
          cashBalance: true,
          restaurantTimes: true
        },
        take: pagination.limit,
        skip: pagination.offset
      });
    }
  );

  /**
   * @method GET
   * @route /restaurants/query
   * @return {Restaurant[]}
   */
  fastify.get(
    "/query",
    { schema: RestaurantsSchema.byDishes },
    async (req: FastifyRequest<IRestaurantsByDishes>, rep) => {
      const query = req.query;
      const pagination = new PaginationHelper(query.limit, query.page);

      const priceQuery: { gte?: number; lte?: number } = {};

      if (query.min_price && query.min_price > -1) {
        priceQuery.gte = query.min_price;
      }

      if (query.max_price && query.max_price > -1) {
        priceQuery.lte = query.max_price;
      }

      const countQuery: { gte?: number; lte?: number } = {};

      if (query.min_dishes && query.min_dishes > -1) {
        countQuery.gte = query.min_dishes;
      }

      if (query.max_dishes && query.max_dishes > -1) {
        countQuery.gte = query.max_dishes;
      }

      console.log(priceQuery, countQuery);

      const restaurantId = (
        await PrismaInstance.restaurantDish.groupBy({
          by: ["restaurantId", "dishId"],
          where: {
            price: priceQuery
          },
          having:
            query.max_dishes !== undefined || query.min_dishes !== undefined
              ? {
                  dishId: {
                    _count: countQuery
                  }
                }
              : undefined,
          orderBy: { restaurantId: "asc" },
          take: pagination.limit,
          skip: pagination.offset
        })
      ).map(d => d.restaurantId);

      return PrismaInstance.restaurant.findMany({
        where: {
          id: {
            in: restaurantId
          }
        },
        orderBy: {
          restaurantName: "asc"
        },
        include: {
          restaurantDishes: {
            include: { dish: true },
            where: {
              price: priceQuery
            }
          },
          restaurantTimes: true
        }
      });
    }
  );

  /**
   * @method GET
   * @route /restaurants/search
   * @return {Restaurant[]}
   */
  fastify.get(
    "/search",
    { schema: RestaurantsSchema.restaurantSearch },
    async (req: FastifyRequest<ISearchQuery>) => {
      const { page, limit, q } = req.query;
      const pagination = new PaginationHelper(limit, page);

      return PrismaInstance.$queryRaw`SELECT * FROM restaurants WHERE "restaurantName" @@ plainto_tsquery(${escapeString(
        q
      )}) LIMIT ${pagination.limit} OFFSET ${pagination.offset}`;
    }
  );
};

export default restaurants;
