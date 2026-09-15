import { and, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import { roomBookings } from "@repo/database";
import type {
  CreateRoomBookingRoute,
  DeleteRoomBookingRoute,
  GetRoomBookingRoute,
  ListRoomBookingsByUserRoute,
  ListRoomBookingsRoute,
  UpdateRoomBookingRoute,
} from "./roomBookings.routes";

// List roomBookings handler
export const listRoomBookingsHandler: AppRouteHandler<
  ListRoomBookingsRoute
> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "desc",
    // search,
    hotelId,
    status, // Remove default value to show all statuses
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const whereConditions = [];

  if (hotelId) {
    whereConditions.push(eq(roomBookings.hotelId, hotelId));
  }

  if (status) {
    whereConditions.push(eq(roomBookings.status, status));
  }

  const query = db.query.roomBookings.findMany({
    limit: limitNum,
    offset,
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
  });

  // Get total count for pagination
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(roomBookings)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  const [roomBookingEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  // Map status: null -> undefined for type compatibility
  const mappedRoomBookingEntries = roomBookingEntries.map((entry) => ({
    ...entry,
    status: entry.status === null ? undefined : entry.status,
  }));

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: mappedRoomBookingEntries,
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

// List roomBookings by user ID handler
export const listRoomBookingsByUserHandler: AppRouteHandler<
  ListRoomBookingsByUserRoute
> = async (c) => {
  const session = c.get("session");
  const user = c.get("user");
  const params = c.req.valid("param");
  const {
    page = "1",
    limit = "10",
    sort = "desc",
    // search,
    hotelId,
    status,
  } = c.req.valid("query");

  if (!session || !user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if user is requesting their own bookings or is an admin
  if (user.role !== "admin" && params.userId !== user.id) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const whereConditions = [eq(roomBookings.createdBy, params.userId)];

  if (hotelId) {
    whereConditions.push(eq(roomBookings.hotelId, hotelId));
  }

  if (status) {
    whereConditions.push(eq(roomBookings.status, status));
  }

  const query = db.query.roomBookings.findMany({
    limit: limitNum,
    offset,
    where: and(...whereConditions),
  });

  // Get total count for pagination
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(roomBookings)
    .where(and(...whereConditions));

  const [roomBookingEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  // Map status: null -> undefined for type compatibility
  const mappedRoomBookingEntries = roomBookingEntries.map((entry) => ({
    ...entry,
    status: entry.status === null ? undefined : entry.status,
  }));

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: mappedRoomBookingEntries,
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

// Get roomBooking handler
export const getRoomBookingHandler: AppRouteHandler<
  GetRoomBookingRoute
> = async (c) => {
  const params = c.req.valid("param");

  const roomBooking = await db.query.roomBookings.findFirst({
    where: eq(roomBookings.id, params.id),
  });

  if (!roomBooking) {
    return c.json(
      { message: "RoomBooking not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(roomBooking, HttpStatusCodes.OK);
};

// Update the createRoomBookingHandler to make organizationId optional
export const createRoomBookingHandler: AppRouteHandler<
  CreateRoomBookingRoute
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

  let activeOrganizationId = session.activeOrganizationId || null;

  // Try to get organization from various sources if not available
  if (!activeOrganizationId) {
    // First try to get from user's organization membership
    if (user.role === "user") {
      const organizationMember = await db.query.member.findFirst({
        where: (fields, { eq }) => eq(fields.userId, user.id),
      });

      if (organizationMember && organizationMember.role !== "member") {
        activeOrganizationId = organizationMember.organizationId;
      }
    }

    // If still no organization, try to get from the hotel
    if (!activeOrganizationId && body.hotelId) {
      const hotel = await db.query.hotels.findFirst({
        where: (fields, { eq }) => eq(fields.id, body.hotelId),
        columns: { organizationId: true },
      });

      if (hotel) {
        activeOrganizationId = hotel.organizationId;
      }
    }
  }

  // Note: activeOrganizationId can be null now - it's optional

  // Clean up the data and ensure proper types
  const cleanedData = {
    hotelId: body.hotelId,
    roomTypeId: body.roomTypeId,
    guestName: body.guestName,
    paymentType: body.paymentType,
    guestEmail: body.guestEmail || null,
    guestPhone: body.guestPhone || null,
    checkInDate: body.checkInDate || null,
    checkInTime: body.checkInTime || null,
    checkOutDate: body.checkOutDate || null,
    checkOutTime: body.checkOutTime || null,
    numRooms: body.numRooms || 1,
    numAdults: body.numAdults || 1,
    numChildren: body.numChildren || 0,
    totalAmount: body.totalAmount || null,
    commissionAmount: body.commissionAmount || null,
    netPayableToHotel: body.netPayableToHotel || null,
    currency: body.currency || null,
    specialRequests: body.specialRequests || null,
    notes: body.notes || null,
    isPaid: body.isPaid || false,
    paymentDetails: body.paymentDetails || null,
    // Set system fields
    createdBy: user.id,
    organizationId: activeOrganizationId, // Can be null now
  };

  try {
    const [inserted] = await db
      .insert(roomBookings)
      .values(cleanedData)
      .returning();

    return c.json(inserted, HttpStatusCodes.CREATED);
  } catch (error) {
    console.error("Database insertion error:", error);
    // Use 403 Forbidden for unexpected errors if 500 is not allowed by OpenAPI spec
    return c.json(
      {
        message: "Failed to create room booking",
      },
      HttpStatusCodes.FORBIDDEN
    );
  }
};

// Update roomBooking handler
export const updateRoomBookingHandler: AppRouteHandler<
  UpdateRoomBookingRoute
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

  // Get roomBooking without relations to avoid the error
  const roomBooking = await db.query.roomBookings.findFirst({
    where: eq(roomBookings.id, params.id),
  });

  if (!roomBooking) {
    return c.json(
      { message: "RoomBooking not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Check permissions
  // if (user.role !== "admin") {
  //   return c.json(
  //     { message: HttpStatusPhrases.FORBIDDEN },
  //     HttpStatusCodes.FORBIDDEN
  //   );
  // }

  try {
    // Only update fields that are provided in the request body
    // All other fields will keep their existing values
    const updateData = {
      ...body, // Only includes fields sent in the request
      updatedAt: new Date(),
    };

    const [updated] = await db
      .update(roomBookings)
      .set(updateData)
      .where(eq(roomBookings.id, params.id))
      .returning();

    return c.json(updated, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Update error:", error);
    return c.json(
      { message: "Failed to update room booking" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Delete roomBooking handler
export const deleteRoomBookingHandler: AppRouteHandler<
  DeleteRoomBookingRoute
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

  // Get roomBooking with hotel info
  const roomBooking = await db.query.roomBookings.findFirst({
    where: eq(roomBookings.id, params.id),
    // with: {
    //   hotel: true,
    // },
  });

  if (!roomBooking) {
    return c.json(
      { message: "RoomBooking not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Check permissions
  if (user.role !== "admin" && roomBooking.createdBy !== user.id) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  await db.delete(roomBookings).where(eq(roomBookings.id, params.id));

  return c.json(
    { message: "RoomBooking deleted successfully" },
    HttpStatusCodes.OK
  );
};
