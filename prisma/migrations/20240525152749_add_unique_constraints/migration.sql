/*
  Warnings:

  - A unique constraint covering the columns `[name,img_link]` on the table `Connections` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Connections_name_img_link_key" ON "Connections"("name", "img_link");
