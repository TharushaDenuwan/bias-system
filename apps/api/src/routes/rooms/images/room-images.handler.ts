import { and, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import { hotelImages, roomTypes } from "@repo/database";
import type {
  AddRoomImageRoute,
  GetRoomImagesRoute,
  RemoveRoomImageRoute,
  UpdateRoomImageRoute
} from "./room-images.routes";

// Get room images handler
export const getRoomImagesHandler: AppRouteHandler<GetRoomImagesRoute> = async (
  c
) => {
  const params = c.req.valid("param");
  const { page = "1", limit = "10" } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Verify room type exists
  const roomType = await db.query.roomTypes.findFirst({
    where: eq(roomTypes.id, params.id)
  });

  if (!roomType) {
    return c.json(
      { message: "Room type not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Get images for this room type
  const imagesData = await db.query.hotelImages.findMany({
    where: eq(hotelImages.roomTypeId, params.id),
    limit: limitNum,
    offset,
    orderBy: (fields, { asc }) => asc(fields.displayOrder)
  });

  // Get total count
  const totalCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(hotelImages)
    .where(eq(hotelImages.roomTypeId, params.id));

  const totalCount = totalCountResult[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: imagesData,
      meta: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum
      }
    },
    HttpStatusCodes.OK
  );
};

// Add room image handler
export const addRoomImageHandler: AppRouteHandler<AddRoomImageRoute> = async (
  c
) => {
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

  // Verify room type exists
  const roomType = await db.query.roomTypes.findFirst({
    where: eq(roomTypes.id, params.id),
    with: { hotel: true }
  });

  if (!roomType) {
    return c.json(
      { message: "Room type not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Insert the new image
  const [inserted] = await db
    .insert(hotelImages)
    .values({
      ...body,
      hotelId: roomType.hotelId,
      roomTypeId: params.id
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Update room image handler
export const updateRoomImageHandler: AppRouteHandler<
  UpdateRoomImageRoute
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

  // Verify image exists and belongs to this room type
  const image = await db.query.hotelImages.findFirst({
    where: and(
      eq(hotelImages.id, params.imageId),
      eq(hotelImages.roomTypeId, params.id)
    )
  });

  if (!image) {
    return c.json({ message: "Image not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Update the image
  const [updated] = await db
    .update(hotelImages)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(hotelImages.id, params.imageId))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Remove room image handler
export const removeRoomImageHandler: AppRouteHandler<
  RemoveRoomImageRoute
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

  // Verify image exists and belongs to this room type
  const image = await db.query.hotelImages.findFirst({
    where: and(
      eq(hotelImages.id, params.imageId),
      eq(hotelImages.roomTypeId, params.id)
    )
  });

  if (!image) {
    return c.json({ message: "Image not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Delete the image
  await db.delete(hotelImages).where(eq(hotelImages.id, params.imageId));

  return c.json(
    { message: "Room image removed successfully" },
    HttpStatusCodes.OK
  );
};
