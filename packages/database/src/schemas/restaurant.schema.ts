import { sql } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { organization, user } from "./auth.schema";
import { hotels } from "./hotel.schema";

export const restaurantStatusEnum = pgEnum("restaurant_status", [
  "active",
  "inactive",
  "under_maintenance",
  "pending_approval",
]);
// Core Restaurant & Property Management Tables
export const restaurants = pgTable(
  "restaurants",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),
    createdBy: text("created_by")
      .references(() => user.id, { onDelete: "set null" })
      .notNull(),
    organizationId: text("organization_id")
      .references(() => organization.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    brandName: varchar("brand_name", { length: 255 }),
    // Buffet details

    buffetMetadata: text("buffet_metadata"), // e.g., number of items, cuisine types

    // Address fields
    street: varchar("street", { length: 255 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    postalCode: varchar("postal_code", { length: 20 }).notNull(),
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),

    // Contact info
    phone: varchar("phone", { length: 20 }),
    email: varchar("email", { length: 255 }),
    website: varchar("website", { length: 500 }),

    starRating: integer("star_rating").default(0),
    // Operational details
    checkInTime: varchar("check_in_time", { length: 5 }).default("15:00"), // HH:MM format
    checkOutTime: varchar("check_out_time", { length: 5 }).default("11:00"), // HH:MM format

    status: restaurantStatusEnum("status")
      .default("pending_approval")
      .notNull(),

    ...timestamps,
  },
  (table) => [
    index("restaurants_city_idx").on(table.city),
    index("restaurants_location_idx").on(table.latitude, table.longitude),
    index("restaurants_status_idx").on(table.status),
  ]
);

export const restaurantImages = pgTable(
  "restaurant_images",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    restaurantId: text("restaurant_id")
      .references(() => restaurants.id, { onDelete: "cascade" })
      .notNull(),

    imageUrl: text("image_url").notNull(),
    altText: varchar("alt_text", { length: 255 }),
    displayOrder: integer("display_order").default(0),
    isThumbnail: boolean("is_thumbnail").default(false),

    ...timestamps,
  },
  (table) => [
    index("restaurant_images_restaurant_idx").on(table.restaurantId),
    index("restaurant_images_display_order_idx").on(table.displayOrder),
  ]
);
