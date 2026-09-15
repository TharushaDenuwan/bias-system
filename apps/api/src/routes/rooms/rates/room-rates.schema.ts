import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { roomRatePlans, roomRates, roomSeasonalRates } from "@repo/database";

// Room Rate Plans Schemas
export const roomRatePlanSchema = createSelectSchema(roomRatePlans);

export type RoomRatePlan = z.infer<typeof roomRatePlanSchema>;

export const roomRatePlanInsertSchema = createInsertSchema(roomRatePlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type RoomRatePlanInsert = z.infer<typeof roomRatePlanInsertSchema>;

export const roomRatePlanUpdateSchema = createInsertSchema(roomRatePlans)
  .omit({
    id: true,
    roomTypeId: true,
    createdAt: true,
    updatedAt: true
  })
  .partial();

export type RoomRatePlanUpdate = z.infer<typeof roomRatePlanUpdateSchema>;

// Room Rates Schemas
export const roomRateSchema = createSelectSchema(roomRates);

export type RoomRate = z.infer<typeof roomRateSchema>;

export const roomRateInsertSchema = createInsertSchema(roomRates).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type RoomRateInsert = z.infer<typeof roomRateInsertSchema>;

export const roomRateUpdateSchema = createInsertSchema(roomRates)
  .omit({
    id: true,
    ratePlanId: true,
    createdAt: true,
    updatedAt: true
  })
  .partial();

export type RoomRateUpdate = z.infer<typeof roomRateUpdateSchema>;

// Room Seasonal Rates Schemas
export const roomSeasonalRateSchema = createSelectSchema(roomSeasonalRates);

export type RoomSeasonalRate = z.infer<typeof roomSeasonalRateSchema>;

export const roomSeasonalRateInsertSchema = createInsertSchema(
  roomSeasonalRates
).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type RoomSeasonalRateInsert = z.infer<
  typeof roomSeasonalRateInsertSchema
>;

export const roomSeasonalRateUpdateSchema = createInsertSchema(
  roomSeasonalRates
)
  .omit({
    id: true,
    ratePlanId: true,
    createdAt: true,
    updatedAt: true
  })
  .partial();

export type RoomSeasonalRateUpdate = z.infer<
  typeof roomSeasonalRateUpdateSchema
>;

// Combined schemas with relations
export const roomRatePlanWithRelationsSchema = roomRatePlanSchema.extend({
  rates: z.array(roomRateSchema).optional(),
  seasonalRates: z.array(roomSeasonalRateSchema).optional()
});

export type RoomRatePlanWithRelations = z.infer<
  typeof roomRatePlanWithRelationsSchema
>;

// Query Params Schemas
export const roomRatePlanQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  roomTypeId: z.string().optional(),
  ratePlanType: z
    .enum([
      "standard",
      "advance_purchase",
      "non_refundable",
      "last_minute",
      "package"
    ])
    .optional(),
  isActive: z.enum(["true", "false"]).optional()
});

export const roomRateQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  ratePlanId: z.string().optional(),
  dateFrom: z.string().optional(), // YYYY-MM-DD format
  dateTo: z.string().optional(), // YYYY-MM-DD format
  isClosed: z.enum(["true", "false"]).optional()
});
