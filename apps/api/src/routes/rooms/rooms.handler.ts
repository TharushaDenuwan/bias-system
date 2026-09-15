import { and, eq, ilike, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import { hotels, rooms, roomTypeAmenities, roomTypes } from "@repo/database";
import type {
  AddRoomTypeAmenityRoute,
  BulkCreateRoomsRoute,
  CreateRoomRoute,
  CreateRoomTypeRoute,
  DeleteRoomRoute,
  DeleteRoomTypeRoute,
  GetRoomRoute,
  GetRoomTypeRoute,
  ListRoomsRoute,
  ListRoomTypesRoute,
  RemoveRoomTypeAmenityRoute,
  UpdateRoomRoute,
  UpdateRoomTypeRoute,
} from "./rooms.routes";

/**
 * ================================================================
 * Room Types Handlers
 * ================================================================
 */

// List room types handler
export const listRoomTypesHandler: AppRouteHandler<ListRoomTypesRoute> = async (
  c
) => {
  const {
    page = "1",
    limit = "10",
    sort = "desc",
    search,
    hotelId,
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const whereConditions = [];

  if (hotelId) {
    whereConditions.push(eq(roomTypes.hotelId, hotelId));
  }

  if (search) {
    whereConditions.push(ilike(roomTypes.name, `%${search}%`));
  }

  const query = db.query.roomTypes.findMany({
    limit: limitNum,
    offset,
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
    orderBy: (fields) =>
      sort === "asc" ? [fields.name] : [sql`${fields.name} DESC`],
    with: {
      amenities: true,
      rooms: true,
    },
  });

  // Get total count for pagination
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(roomTypes)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  const [roomTypeEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: roomTypeEntries,
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

// Get room type handler
export const getRoomTypeHandler: AppRouteHandler<GetRoomTypeRoute> = async (
  c
) => {
  const params = c.req.valid("param");

  const roomType = await db.query.roomTypes.findFirst({
    where: eq(roomTypes.id, params.id),
    with: {
      amenities: true,
      rooms: true,
    },
  });

  if (!roomType) {
    return c.json(
      { message: "Room type not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(roomType, HttpStatusCodes.OK);
};

// Create room type handler
export const createRoomTypeHandler: AppRouteHandler<
  CreateRoomTypeRoute
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

  // Verify user has access to the hotel
  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, body.hotelId),
  });

  if (!hotel) {
    return c.json({ message: "Hotel not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // For non-admin users, check if they own the hotel
  if (user.role !== "admin" && hotel.createdBy !== user.id) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [inserted] = await db.insert(roomTypes).values(body).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Update room type handler
export const updateRoomTypeHandler: AppRouteHandler<
  UpdateRoomTypeRoute
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

  // Get room type with hotel info
  const roomType = await db.query.roomTypes.findFirst({
    where: eq(roomTypes.id, params.id),
    with: {
      hotel: true,
    },
  });

  if (!roomType) {
    return c.json(
      { message: "Room type not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Check permissions
  if (user.role !== "admin" && roomType.hotel.createdBy !== user.id) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [updated] = await db
    .update(roomTypes)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(roomTypes.id, params.id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete room type handler
export const deleteRoomTypeHandler: AppRouteHandler<
  DeleteRoomTypeRoute
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

  // Get room type with hotel info
  const roomType = await db.query.roomTypes.findFirst({
    where: eq(roomTypes.id, params.id),
    with: {
      hotel: true,
    },
  });

  if (!roomType) {
    return c.json(
      { message: "Room type not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Check permissions
  if (user.role !== "admin" && roomType.hotel.createdBy !== user.id) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  await db.delete(roomTypes).where(eq(roomTypes.id, params.id));

  return c.json(
    { message: "Room type deleted successfully" },
    HttpStatusCodes.OK
  );
};

/**
 * ================================================================
 * Room Type Amenities Handlers
 * ================================================================
 */

// Add room type amenity handler
export const addRoomTypeAmenityHandler: AppRouteHandler<
  AddRoomTypeAmenityRoute
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

  // Verify room type exists
  const roomType = await db.query.roomTypes.findFirst({
    where: eq(roomTypes.id, params.id),
    with: {
      hotel: true,
    },
  });

  if (!roomType) {
    return c.json(
      { message: "Room type not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Check permissions
  if (user.role !== "admin" && roomType.hotel.createdBy !== user.id) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [inserted] = await db
    .insert(roomTypeAmenities)
    .values({
      ...body,
      roomTypeId: params.id,
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Remove room type amenity handler
export const removeRoomTypeAmenityHandler: AppRouteHandler<
  RemoveRoomTypeAmenityRoute
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

  // Verify amenity exists and get room type info
  const amenity = await db.query.roomTypeAmenities.findFirst({
    where: eq(roomTypeAmenities.id, params.amenityId),
    with: {
      roomType: {
        with: {
          hotel: true,
        },
      },
    },
  });

  if (!amenity) {
    return c.json({ message: "Amenity not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Check permissions
  if (user.role !== "admin" && amenity.roomType.hotel.createdBy !== user.id) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  await db
    .delete(roomTypeAmenities)
    .where(eq(roomTypeAmenities.id, params.amenityId));

  return c.json(
    { message: "Amenity removed successfully" },
    HttpStatusCodes.OK
  );
};

/**
 * ================================================================
 * Rooms Handlers
 * ================================================================
 */

// List rooms handler
export const listRoomsHandler: AppRouteHandler<ListRoomsRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "desc",
    search,
    hotelId,
    roomTypeId,
    status,
    floorNumber,
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const whereConditions = [];

  if (hotelId) {
    whereConditions.push(eq(rooms.hotelId, hotelId));
  }

  if (roomTypeId) {
    whereConditions.push(eq(rooms.roomTypeId, roomTypeId));
  }

  if (status) {
    whereConditions.push(eq(rooms.status, status));
  }

  if (floorNumber) {
    whereConditions.push(eq(rooms.floorNumber, parseInt(floorNumber)));
  }

  if (search) {
    whereConditions.push(ilike(rooms.roomNumber, `%${search}%`));
  }

  const query = db.query.rooms.findMany({
    limit: limitNum,
    offset,
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
    orderBy: (fields) =>
      sort === "asc" ? [fields.roomNumber] : [sql`${fields.roomNumber} DESC`],
    with: {
      roomType: true,
    },
  });

  // Get total count for pagination
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(rooms)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  const [roomEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: roomEntries,
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

// Get room handler
export const getRoomHandler: AppRouteHandler<GetRoomRoute> = async (c) => {
  const params = c.req.valid("param");

  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, params.id),
    with: {
      roomType: true,
    },
  });

  if (!room) {
    return c.json({ message: "Room not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(room, HttpStatusCodes.OK);
};

// Create room handler
export const createRoomHandler: AppRouteHandler<CreateRoomRoute> = async (
  c
) => {
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

  // Check if room number already exists in the hotel
  const existingRoom = await db.query.rooms.findFirst({
    where: and(
      eq(rooms.hotelId, body.hotelId),
      eq(rooms.roomNumber, body.roomNumber)
    ),
  });

  if (existingRoom) {
    return c.json(
      { message: "Room number already exists in this hotel" },
      HttpStatusCodes.CONFLICT
    );
  }

  const [inserted] = await db.insert(rooms).values(body).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Update room handler
export const updateRoomHandler: AppRouteHandler<UpdateRoomRoute> = async (
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

  // Get room with hotel info
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, params.id),
    with: {
      hotel: true,
    },
  });

  if (!room) {
    return c.json({ message: "Room not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Check permissions
  if (user.role !== "admin" && room.hotel.createdBy !== user.id) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [updated] = await db
    .update(rooms)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(rooms.id, params.id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete room handler
export const deleteRoomHandler: AppRouteHandler<DeleteRoomRoute> = async (
  c
) => {
  const params = c.req.valid("param");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Get room with hotel info
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, params.id),
    with: {
      hotel: true,
    },
  });

  if (!room) {
    return c.json({ message: "Room not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Check permissions
  if (user.role !== "admin" && room.hotel.createdBy !== user.id) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  await db.delete(rooms).where(eq(rooms.id, params.id));

  return c.json({ message: "Room deleted successfully" }, HttpStatusCodes.OK);
};

// Bulk create rooms handler
export const bulkCreateRoomsHandler: AppRouteHandler<
  BulkCreateRoomsRoute
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
  if (hotel.createdBy !== user.id) {
    return c.json(
      { message: "Hotel is not created by you" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Check if any room numbers already exist
  const existingRooms = await db.query.rooms.findMany({
    where: and(
      eq(rooms.hotelId, body.hotelId)
      // sql`${rooms.roomNumber} = ANY(${body.roomNumbers})`
    ),
  });

  console.log({ existingRooms });

  if (existingRooms.length > 0) {
    const existingNumbers = existingRooms.map((r) => r.roomNumber);
    console.log({ existingNumbers });
    body.roomNumbers = body.roomNumbers.filter(
      (num) => !existingNumbers.includes(num)
    );
    // return c.json(
    //   { message: `Room numbers already exist: ${existingNumbers.join(", ")}` },
    //   HttpStatusCodes.CONFLICT
    // );
  }

  // Prepare bulk insert data
  const roomData = body.roomNumbers.map((roomNumber) => ({
    hotelId: body.hotelId,
    roomTypeId: body.roomTypeId,
    roomNumber,
    floorNumber: body.floorNumber,
    isAccessible: body.isAccessible || false,
  }));

  const insertedRooms = await db.insert(rooms).values(roomData).returning();

  return c.json(
    {
      message: `Successfully created ${insertedRooms.length} rooms`,
      created: insertedRooms.length,
      rooms: insertedRooms,
    },
    HttpStatusCodes.CREATED
  );
};
