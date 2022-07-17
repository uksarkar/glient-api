-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cashBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "restaurnatId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "transactionAmount" DOUBLE PRECISION NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurants" (
    "id" SERIAL NOT NULL,
    "restaurantName" TEXT NOT NULL,
    "cashBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dishes" (
    "id" SERIAL NOT NULL,
    "dishName" TEXT NOT NULL,

    CONSTRAINT "dishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant_dishes" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "dishId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "restaurant_dishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant_times" (
    "id" SERIAL NOT NULL,
    "openAt" TIMESTAMP(3) NOT NULL,
    "closeAt" TIMESTAMP(3) NOT NULL,
    "restaurantId" INTEGER NOT NULL,

    CONSTRAINT "restaurant_times_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_dishes_restaurantId_key" ON "restaurant_dishes"("restaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_dishes_dishId_key" ON "restaurant_dishes"("dishId");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_restaurnatId_fkey" FOREIGN KEY ("restaurnatId") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_dishes" ADD CONSTRAINT "restaurant_dishes_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_dishes" ADD CONSTRAINT "restaurant_dishes_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_times" ADD CONSTRAINT "restaurant_times_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
