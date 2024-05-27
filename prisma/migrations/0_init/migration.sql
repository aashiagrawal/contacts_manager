-- CreateTable
CREATE TABLE "Connections" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "img_link" VARCHAR,
    "bio" VARCHAR,
    "connection_date" VARCHAR,

    CONSTRAINT "Connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Connections_id_key" ON "Connections"("id");

