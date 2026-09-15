import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { restaurantImages, restaurants } from "@repo/database";

// Hotel Image Schema (to avoid circular dependency)
export const restaurantImageSchema = createSelectSchema(restaurantImages);

export type RestaurantImage = z.infer<typeof restaurantImageSchema>;

// Restaurants Schemas
export const restaurantSchema = createSelectSchema(restaurants);

export type Restaurant = z.infer<typeof restaurantSchema>;

export const restaurantInsertSchema = createInsertSchema(restaurants).omit({
  id: true,
  organizationId: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

export type RestaurantInsert = z.infer<typeof restaurantInsertSchema>;

export const restaurantUpdateSchema = createInsertSchema(restaurants)
  .omit({
    id: true,
    createdBy: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type RestaurantUpdate = z.infer<typeof restaurantUpdateSchema>;

export const restaurantWithRelationsSchema = restaurantSchema.extend({});

export type RestaurantWithRelations = z.infer<
  typeof restaurantWithRelationsSchema
>;

// Query Params Schemas
export const restaurantTypeQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  hotelId: z.string().optional(),
});

export const restaurantQueryParamsSchema = z.object({
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
