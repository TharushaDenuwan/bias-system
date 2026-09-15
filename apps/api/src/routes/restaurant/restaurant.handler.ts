import { and, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import { hotels, restaurants } from "@repo/database";
import type {
  CreateRestaurantRoute,
  DeleteRestaurantRoute,
  GetMyRestaurantRoute,
  GetRestaurantRoute,
  ListRestaurantsRoute,
  UpdateRestaurantRoute,
} from "./restaurant.routes";

// List restaurants handler
export const listRestaurantsHandler: AppRouteHandler<
  ListRestaurantsRoute
> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "desc",
    hotelId,
    status,
    userId,
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const whereConditions = [];

  if (hotelId) {
    whereConditions.push(eq(restaurants.hotelId, hotelId));
  }

  if (status) {
    // Only allow valid enum values for restaurants.status
    const validStatus: (
      | "active"
      | "inactive"
      | "under_maintenance"
      | "pending_approval"
    )[] = ["active", "inactive", "under_maintenance", "pending_approval"];
    if (validStatus.includes(status as any)) {
      whereConditions.push(
        eq(restaurants.status, status as (typeof validStatus)[number])
      );
    }
    // Optionally, you can handle invalid status values here (e.g., ignore or throw error)
  }

  const query = db.query.restaurants.findMany({
    limit: limitNum,
    offset,
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
    orderBy: (fields) =>
      sort === "asc" ? [fields.name] : [sql`${fields.name} DESC`],
  });

  // Get total count for pagination
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(restaurants)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  const [restaurantEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: restaurantEntries,
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

// Get restaurant handler
export const getRestaurantHandler: AppRouteHandler<GetRestaurantRoute> = async (
  c
) => {
  const params = c.req.valid("param");

  const restaurant = await db.query.restaurants.findFirst({
    where: eq(restaurants.id, params.id),
  });

  if (!restaurant) {
    return c.json(
      { message: "Restaurant not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(restaurant, HttpStatusCodes.OK);
};

// Create restaurant handler
export const createRestaurantHandler: AppRouteHandler<
  CreateRestaurantRoute
> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Verify hotel exists and user has access
  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, body.hotelId),
  });

  if (!hotel) {
    return c.json({ message: "Hotel not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Check permissions
  if (user.role !== "admin" && hotel.createdBy !== user.id) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Check if restaurant number already exists in the hotel
  const existingRestaurant = await db.query.restaurants.findFirst({
    where: and(
      eq(restaurants.hotelId, body.hotelId),
      eq(restaurants.city, body.city)
    ),
  });

  if (existingRestaurant) {
    return c.json(
      { message: "Restaurant number already exists in this hotel" },
      HttpStatusCodes.CONFLICT
    );
  }

  // Add organizationId and createdBy from session/user
  const restaurantData = {
    ...body,
    organizationId: session.activeOrganizationId ?? "",
    createdBy: user.id,
  };

  const [inserted] = await db
    .insert(restaurants)
    .values(restaurantData)
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Update restaurant handler
export const updateRestaurantHandler: AppRouteHandler<
  UpdateRestaurantRoute
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

  // Get restaurant
  const restaurant = await db.query.restaurants.findFirst({
    where: eq(restaurants.id, params.id),
  });

  if (!restaurant) {
    return c.json(
      { message: "Restaurant not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Check permissions
  if (user.role !== "admin" && restaurant.createdBy !== user.id) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [updated] = await db
    .update(restaurants)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(restaurants.id, params.id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete restaurant handler
export const deleteRestaurantHandler: AppRouteHandler<
  DeleteRestaurantRoute
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

  // Get restaurant
  const restaurant = await db.query.restaurants.findFirst({
    where: eq(restaurants.id, params.id),
  });

  if (!restaurant) {
    return c.json(
      { message: "Restaurant not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Check permissions
  if (user.role !== "admin" && restaurant.createdBy !== user.id) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  await db.delete(restaurants).where(eq(restaurants.id, params.id));

  return c.json(
    { message: "Restaurant deleted successfully" },
    HttpStatusCodes.OK
  );
};

// Get my restaurant handler (by user id from session)
export const getMyRestaurantHandler: AppRouteHandler<
  GetMyRestaurantRoute
> = async (c) => {
  console.log("test");
  const session = c.get("session");
  const userId = session?.userId; // Get userId from session

  console.log("session:", session);

  if (!session || !userId)
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );

  console.log("userId:", userId);

  // Find restaurant by createdBy (user id from session)
  const myRestaurant = await db.query.restaurants.findFirst({
    where: (fields, { eq }) => eq(fields.createdBy, userId),
  });

  console.log("myRestaurant", myRestaurant);

  if (!myRestaurant) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(myRestaurant, HttpStatusCodes.OK);
};
