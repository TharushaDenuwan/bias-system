import { and, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import { hotels, paymentsHotel } from "@repo/database";
import type {
  CreatePaymentsHotelRoute,
  DeletePaymentsHotelRoute,
  GetPaymentsHotelRoute,
  ListPaymentsHotelsRoute,
  UpdatePaymentsHotelRoute,
} from "./hotel-payment.routes";

// List hotel payments handler
export const listPaymentsHotelsHandler: AppRouteHandler<
  ListPaymentsHotelsRoute
> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "desc",
    hotelId,
    type,
    paid,
    dueDateFrom,
    dueDateTo,
    dateFrom,
    dateTo,
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const whereConditions = [];

  if (hotelId) {
    whereConditions.push(eq(paymentsHotel.hotelId, hotelId));
  }

  if (type) {
    // Only allow valid payment types for hotel payments
    const validTypes = [
      "receive_commission_from_cash",
      "repay_net_from_online",
    ];
    if (validTypes.includes(type)) {
      whereConditions.push(eq(paymentsHotel.type, type));
    }
  }

  if (paid) {
    const isPaid = paid === "true";
    whereConditions.push(eq(paymentsHotel.paid, isPaid));
  }

  if (dueDateFrom) {
    const fromDate = new Date(dueDateFrom);
    whereConditions.push(sql`${paymentsHotel.dueDate} >= ${fromDate}`);
  }

  if (dueDateTo) {
    const toDate = new Date(dueDateTo);
    whereConditions.push(sql`${paymentsHotel.dueDate} <= ${toDate}`);
  }

  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    whereConditions.push(sql`${paymentsHotel.createdAt} >= ${fromDate}`);
  }

  if (dateTo) {
    const toDate = new Date(dateTo);
    whereConditions.push(sql`${paymentsHotel.createdAt} <= ${toDate}`);
  }

  const query = db.query.paymentsHotel.findMany({
    limit: limitNum,
    offset,
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
    orderBy: (fields) =>
      sort === "asc" ? [fields.createdAt] : [sql`${fields.createdAt} DESC`],
  });

  // Get total count for pagination
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(paymentsHotel)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  const [paymentsHotelEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: paymentsHotelEntries,
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

// Get hotel payment handler
export const getPaymentsHotelHandler: AppRouteHandler<
  GetPaymentsHotelRoute
> = async (c) => {
  const params = c.req.valid("param");

  const paymentEntry = await db.query.paymentsHotel.findFirst({
    where: eq(paymentsHotel.id, params.id),
  });

  if (!paymentEntry) {
    return c.json(
      { message: "Hotel payment not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(paymentEntry, HttpStatusCodes.OK);
};

// Create hotel payment handler
export const createPaymentsHotelHandler: AppRouteHandler<
  CreatePaymentsHotelRoute
> = async (c) => {
  const body = c.req.valid("json");

  // Verify hotel exists
  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, body.hotelId),
  });

  if (!hotel) {
    return c.json({ message: "Hotel not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Add organizationId from the hotel
  const paymentsHotelData = {
    ...body,
    organizationId: hotel.organizationId,
  };

  const [inserted] = await db
    .insert(paymentsHotel)
    .values(paymentsHotelData)
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Update hotel payment handler
export const updatePaymentsHotelHandler: AppRouteHandler<
  UpdatePaymentsHotelRoute
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

  // Get payment entry
  const paymentEntry = await db.query.paymentsHotel.findFirst({
    where: eq(paymentsHotel.id, params.id),
  });

  if (!paymentEntry) {
    return c.json(
      { message: "Hotel payment not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Check permissions - only admins or organization members can update payments
  if (
    user.role !== "admin" &&
    paymentEntry.organizationId !== session.activeOrganizationId
  ) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [updated] = await db
    .update(paymentsHotel)
    .set(body)
    .where(eq(paymentsHotel.id, params.id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete hotel payment handler
export const deletePaymentsHotelHandler: AppRouteHandler<
  DeletePaymentsHotelRoute
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

  // Get payment entry
  const paymentEntry = await db.query.paymentsHotel.findFirst({
    where: eq(paymentsHotel.id, params.id),
  });

  if (!paymentEntry) {
    return c.json(
      { message: "Hotel payment not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Check permissions - only admins or organization members can delete payments
  if (
    user.role !== "admin" &&
    paymentEntry.organizationId !== session.activeOrganizationId
  ) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  await db.delete(paymentsHotel).where(eq(paymentsHotel.id, params.id));

  return c.json(
    { message: "Hotel payment deleted successfully" },
    HttpStatusCodes.OK
  );
};
