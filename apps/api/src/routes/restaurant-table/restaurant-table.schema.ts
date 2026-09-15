import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { restaurantTables } from "@repo/database";

export const selectRestaurantTablesSchema =
  createSelectSchema(restaurantTables);

export const insertRestaurantTablesSchema = createInsertSchema(
  restaurantTables,
  {
    name: (val) => val.min(1).max(500),
  }
).omit({
  id: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
});

export const updateRestaurantTablesSchema = createInsertSchema(restaurantTables)
  .omit({
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
  })
  .partial();

// Type Definitions
export type RestaurantTables = z.infer<typeof selectRestaurantTablesSchema>;

export type InsertRestaurantTables = z.infer<
  typeof insertRestaurantTablesSchema
>;

export type UpdateRestaurantTables = z.infer<
  typeof updateRestaurantTablesSchema
>;
