import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { hotelImages, villas } from "@repo/database";

// Hotel Image Schema (to avoid circular dependency)
export const hotelImageSchema = createSelectSchema(hotelImages);

export type HotelImage = z.infer<typeof hotelImageSchema>;

// Villas Schemas
export const villaSchema = createSelectSchema(villas);

export type Villa = z.infer<typeof villaSchema>;

export const villaInsertSchema = createInsertSchema(villas).omit({
  id: true,
  organizationId: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

export type VillaInsert = z.infer<typeof villaInsertSchema>;

export const villaUpdateSchema = createInsertSchema(villas)
  .omit({
    id: true,
    createdBy: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type VillaUpdate = z.infer<typeof villaUpdateSchema>;

export const villaWithRelationsSchema = villaSchema.extend({});

export type VillaWithRelations = z.infer<typeof villaWithRelationsSchema>;

// Query Params Schemas
export const villaTypeQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  hotelId: z.string().optional(),
});

export const villaQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  hotelId: z.string().optional(),
  status: z
    .enum(["available", "occupied", "maintenance", "out_of_order", "dirty"])
    .optional(),
  floorNumber: z.string().optional(),
});
