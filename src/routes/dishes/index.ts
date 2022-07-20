import { FastifyPluginAsync, FastifyRequest } from "fastify";
import dishSearch from "../../schema/DishRequestSchema";
import purchaseData, {
  IPurchaseDishSchema
} from "../../schema/PurchaseDishSchema";
import { ISearchQuery } from "../../schema/SearchSchema";
import PaginationHelper from "../../utils/PaginationHelper";
import PrismaInstance from "../../utils/PrismaInstance";
const escapeString = require("sql-string-escape");

const dishes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get(
    "/",
    {
      schema: dishSearch
    },
    async (request: FastifyRequest<ISearchQuery>) => {
      const { limit, page, q } = request.query;
      const pagination = new PaginationHelper(limit, page);

      const dishes = (
        await PrismaInstance.$queryRaw<
          { id: number }[]
        >`SELECT id, "dishName" FROM dishes WHERE "dishName" @@ plainto_tsquery(${escapeString(
          q
        )}) LIMIT ${pagination.limit} OFFSET ${pagination.offset}`
      ).map(d => d.id);

      return PrismaInstance.restaurantDish.findMany({
        where: {
          dishId: {
            in: dishes
          }
        },
        include: {
          dish: true,
          restaurant: {
            include: {
              restaurantTimes: true
            }
          }
        },
        orderBy: { dish: { dishName: "asc" } }
      });
    }
  );

  fastify.post(
    "/purchase",
    { schema: purchaseData },
    async (request: FastifyRequest<IPurchaseDishSchema>) => {
      const { dishId, restaurantId, userId } = request.body;

      const restaurantDish = await PrismaInstance.restaurantDish.findFirst({
        where: { dishId, restaurantId }
      });

      if (!restaurantDish)
        throw {
          statusCode: 404,
          message: "The restaurant with this dish not found"
        };

      const user = await PrismaInstance.user.findFirst({
        where: { id: userId }
      });

      if (!user)
        throw {
          statusCode: 404,
          message: "User not found"
        };

      if (user.cashBalance < restaurantDish.price)
        throw {
          statusCode: 422,
          message: "Insufficient cash balance."
        };

      const tnx = await PrismaInstance.transaction.create({
        data: {
          transactionAmount: restaurantDish.price,
          dishId,
          restaurantId,
          userId
        }
      });

      return {
        status: "SUCCESS",
        tnx
      };
    }
  );
};

export default dishes;
