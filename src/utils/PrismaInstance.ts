import { PrismaClient } from "@prisma/client";

const PrismaInstance = new PrismaClient();

PrismaInstance.$use(async (params, next) => {
  if (params.model === "Transaction" && params.action === "create") {
    const trx = await next(params);
    await PrismaInstance.$queryRaw`UPDATE users SET "cashBalance" = "cashBalance" - ${trx.transactionAmount}`;
    await PrismaInstance.$queryRaw`UPDATE restaurants SET "cashBalance" = "cashBalance" + ${trx.transactionAmount}`;
    return trx;
  }
  return next(params);
});

export default PrismaInstance;
