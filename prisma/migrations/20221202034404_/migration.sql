-- CreateTable
CREATE TABLE "menu" (
    "id" BIGSERIAL NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "price" DECIMAL NOT NULL,
    "weight" DECIMAL NOT NULL,
    "image" VARCHAR NOT NULL,

    CONSTRAINT "menu_pkey" PRIMARY KEY ("id")
);
