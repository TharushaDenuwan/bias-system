import { and, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import { restaurantImages } from "@repo/database";
import type {
  AddRestaurantImageRoute,
  GetRestaurantImagesRoute,
  RemoveRestaurantImageRoute,
  UpdateRestaurantImageRoute,
} from "./restaurant-images.routes";

// Get restaurant images handler
export const getRestaurantImagesHandler: AppRouteHandler<
  GetRestaurantImagesRoute
> = async (c) => {
  const params = c.req.valid("param");
  const { page = "1", limit = "10" } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Get images for this restaurant
  const imagesData = await db.query.restaurantImages.findMany({
    where: eq(restaurantImages.restaurantId, params.id),
    limit: limitNum,
    offset,
    orderBy: (fields, { asc }) => asc(fields.displayOrder),
  });
  // Get total count
  const totalCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(restaurantImages)
    .where(eq(restaurantImages.restaurantId, params.id));

  const totalCount = totalCountResult[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: imagesData,
      meta: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
      },
    },
    HttpStatusCodes.OK
  );
};

// Add restaurant image handler
export const addRestaurantImageHandler: AppRouteHandler<
  AddRestaurantImageRoute
> = async (c) => {
  const params = c.req.valid("param");
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Insert the new image
  const [inserted] = await db
    .insert(restaurantImages)
    .values({
      ...body,
      restaurantId: params.id,
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Update restaurant image handler
export const updateRestaurantImageHandler: AppRouteHandler<
  UpdateRestaurantImageRoute
> = async (c) => {
  const params = c.req.valid("param");
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Verify image exists and belongs to this restaurant
  const image = await db.query.restaurantImages.findFirst({
    where: and(
      eq(restaurantImages.id, params.imageId),
      eq(restaurantImages.restaurantId, params.id)
    ),
  });

  if (!image) {
    return c.json({ message: "Image not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Update the image
  const [updated] = await db
    .update(restaurantImages)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(restaurantImages.id, params.imageId))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Remove restaurant image handler
export const removeRestaurantImageHandler: AppRouteHandler<
  RemoveRestaurantImageRoute
> = async (c) => {
  const params = c.req.valid("param");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Verify image exists and belongs to this restaurant
  const image = await db.query.restaurantImages.findFirst({
    where: and(
      eq(restaurantImages.id, params.imageId),
      eq(restaurantImages.restaurantId, params.id)
    ),
  });

  if (!image) {
    return c.json({ message: "Image not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Delete the image
  await db
    .delete(restaurantImages)
    .where(eq(restaurantImages.id, params.imageId));

  return c.json(
    { message: "Restaurant image removed successfully" },
    HttpStatusCodes.OK
  );
};
