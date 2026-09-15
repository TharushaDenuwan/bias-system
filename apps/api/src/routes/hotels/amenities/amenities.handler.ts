/* eslint-disable prefer-const */
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import { hotelAmenities } from "@repo/database";
import type {
  GetHotelAmenitiesRoute,
  UpsertAmenitiesToHotelRoute
} from "./amenities.routes";

// List hotel amenities route handler
export const getHotelAmenitiesHandler: AppRouteHandler<
  GetHotelAmenitiesRoute
> = async (c) => {
  const params = c.req.valid("param");

  const allHotelAmenties = await db.query.hotelAmenities.findMany({
    where(fields, { eq }) {
      return eq(fields.hotelId, params.id);
    }
  });

  return c.json(allHotelAmenties, HttpStatusCodes.OK);
};

// New new hotel images route handler
export const upsertAmenitiesToHotelHandler: AppRouteHandler<
  UpsertAmenitiesToHotelRoute
> = async (c) => {
  const body = c.req.valid("json");
  const params = c.req.valid("param");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (!session.activeOrganizationId) {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const currentAmenities = await db.query.hotelAmenities.findMany({
    where: (fields, { eq }) => eq(fields.hotelId, params.id)
  });

  if (currentAmenities.length > 0) {
    // If amenities already exist, delete them first
    await db
      .delete(hotelAmenities)
      .where(eq(hotelAmenities.hotelId, params.id));
  }

  let insertedAmenities = [];

  await Promise.all(
    body.map(async (amenty) => {
      const _insertedAmenity = await db
        .insert(hotelAmenities)
        .values({
          hotelId: params.id,
          amenityType: amenty.amenityType
        })
        .returning();

      insertedAmenities.push(_insertedAmenity[0]);
    })
  );

  return c.json(body, HttpStatusCodes.CREATED);
};
