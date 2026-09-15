import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import { hotelImages } from "@repo/database";
import type {
  AddNewHotelImagesRoute,
  GetAllHotelImagesRoute,
  GetHotelImagesRoute,
  RemoveHotelImageRoute,
  UpdateHotelImageRoute,
} from "./hotel-images.routes";

/**
 * ================================================================
 * Hotel images Handlers
 * ================================================================
 */
// List hotel images route handler
export const getHotelImagesHandler: AppRouteHandler<
  GetHotelImagesRoute
> = async (c) => {
  const params = c.req.valid("param");

  const allHotelImages = await db.query.hotelImages.findMany({
    where: (fields, { eq }) => eq(fields.hotelId, params.id),
  });

  return c.json(allHotelImages, HttpStatusCodes.OK);
};

// New new hotel images route handler
export const addNewHotelImagesHandler: AppRouteHandler<
  AddNewHotelImagesRoute
> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (!session.activeOrganizationId) {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN,
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const insertedImages = await db.insert(hotelImages).values(body).returning();

  return c.json(insertedImages, HttpStatusCodes.CREATED);
};

// Update hotel image route handler
export const updateHotelImageHandler: AppRouteHandler<
  UpdateHotelImageRoute
> = async (c) => {
  const params = c.req.valid("param");
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (!session.activeOrganizationId) {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN,
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [updatedImage] = await db
    .update(hotelImages)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(hotelImages.id, params.id))
    .returning();

  return c.json(updatedImage, HttpStatusCodes.OK);
};

// Remove hotel image route handler
export const removeHotelImageHandler: AppRouteHandler<
  RemoveHotelImageRoute
> = async (c) => {
  const params = c.req.valid("param");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (!session.activeOrganizationId) {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN,
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [deletedImage] = await db
    .delete(hotelImages)
    .where(eq(hotelImages.id, params.id))
    .returning();

  return c.json(deletedImage, HttpStatusCodes.OK);
};

// Handler to get all images from all hotels
export const getAllHotelImagesHandler: AppRouteHandler<
  GetAllHotelImagesRoute
> = async (c) => {
  const allHotelImages = await db.query.hotelImages.findMany();

  return c.json(allHotelImages, HttpStatusCodes.OK);
};
