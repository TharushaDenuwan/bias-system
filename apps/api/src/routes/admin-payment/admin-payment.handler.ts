import { and, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import { hotels, paymentsAdmin } from "@repo/database";
import type {
  CreatePaymentsAdminRoute,
  DeletePaymentsAdminRoute,
  GetPaymentsAdminRoute,
  ListPaymentsAdminsRoute,
  UpdatePaymentsAdminRoute,
} from "./admin-payment.routes";

// List paymentsAdmins handler
export const listPaymentsAdminsHandler: AppRouteHandler<
  ListPaymentsAdminsRoute
> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "desc",
    hotelId,
    type,
    method,
    settled,
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
    whereConditions.push(eq(paymentsAdmin.hotelId, hotelId));
  }

  if (type) {
    // Only allow valid payment types
    const validTypes = ["incoming", "outgoing"];
    if (validTypes.includes(type)) {
      whereConditions.push(eq(paymentsAdmin.type, type));
    }
  }

  if (method) {
    whereConditions.push(eq(paymentsAdmin.method, method));
  }

  if (settled) {
    const isSettled = settled === "true";
    whereConditions.push(eq(paymentsAdmin.settled, isSettled));
  }

  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    whereConditions.push(sql`${paymentsAdmin.createdAt} >= ${fromDate}`);
  }

  if (dateTo) {
    const toDate = new Date(dateTo);
    whereConditions.push(sql`${paymentsAdmin.createdAt} <= ${toDate}`);
  }

  const query = db.query.paymentsAdmin.findMany({
    limit: limitNum,
    offset,
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
    orderBy: (fields) =>
      sort === "asc" ? [fields.createdAt] : [sql`${fields.createdAt} DESC`],
  });

  // Get total count for pagination
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(paymentsAdmin)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  const [paymentsAdminEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: paymentsAdminEntries,
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

// Get paymentsAdmin handler
export const getPaymentsAdminHandler: AppRouteHandler<
  GetPaymentsAdminRoute
> = async (c) => {
  const params = c.req.valid("param");

  const paymentEntry = await db.query.paymentsAdmin.findFirst({
    where: eq(paymentsAdmin.id, params.id),
  });

  if (!paymentEntry) {
    return c.json(
      { message: "PaymentsAdmin not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(paymentEntry, HttpStatusCodes.OK);
};

// Create paymentsAdmin handler
export const createPaymentsAdminHandler: AppRouteHandler<
  CreatePaymentsAdminRoute
> = async (c) => {
  const body = c.req.valid("json");

  // Verify hotel exists first
  const hotel = await db.query.hotels.findFirst({
    where: eq(hotels.id, body.hotelId),
  });

  if (!hotel) {
    return c.json({ message: "Hotel not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Use hotel's organization ID
  const organizationId = hotel.organizationId;

  // Validate required fields and clean up the data
  const cleanedData = {
    hotelId: body.hotelId,
    bookingId: body.bookingId || null,
    organizationId: organizationId,
    type: body.type || null,
    method: body.method || null,
    amount: body.amount,
    settled: body.settled || false,
    settledAt: body.settled ? new Date() : null,
  };

  // Validate that required fields are not empty
  if (!cleanedData.hotelId) {
    return c.json(
      { message: "Hotel ID is required" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  if (!cleanedData.amount) {
    return c.json({ message: "Amount is required" }, HttpStatusCodes.FORBIDDEN);
  }

  try {
    const [inserted] = await db
      .insert(paymentsAdmin)
      .values(cleanedData)
      .returning();

    return c.json(inserted, HttpStatusCodes.CREATED);
  } catch (error) {
    console.error("Database insertion error:", error);
    return c.json(
      {
        message: "Failed to create admin payment",
      },
      HttpStatusCodes.FORBIDDEN
    );
  }
};

// Update paymentsAdmin handler
export const updatePaymentsAdminHandler: AppRouteHandler<
  UpdatePaymentsAdminRoute
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
  const paymentEntry = await db.query.paymentsAdmin.findFirst({
    where: eq(paymentsAdmin.id, params.id),
  });

  if (!paymentEntry) {
    return c.json(
      { message: "PaymentsAdmin not found" },
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
    .update(paymentsAdmin)
    .set(body)
    .where(eq(paymentsAdmin.id, params.id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete paymentsAdmin handler
export const deletePaymentsAdminHandler: AppRouteHandler<
  DeletePaymentsAdminRoute
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
  const paymentEntry = await db.query.paymentsAdmin.findFirst({
    where: eq(paymentsAdmin.id, params.id),
  });

  if (!paymentEntry) {
    return c.json(
      { message: "PaymentsAdmin not found" },
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

  await db.delete(paymentsAdmin).where(eq(paymentsAdmin.id, params.id));

  return c.json(
    { message: "PaymentsAdmin deleted successfully" },
    HttpStatusCodes.OK
  );
};
