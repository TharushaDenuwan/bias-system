import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth.schema";
import { hotels } from "./hotel.schema";
import { restaurants } from "./restaurant.schema";
import { rooms } from "./room.schema";

export const ads = pgTable("ads", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  // Relations
  hotelId: text("hotel_id").references(() => hotels.id, {
    onDelete: "cascade",
  }),
  roomId: text("room_id").references(() => rooms.id, {
    onDelete: "cascade",
  }),
  restaurantId: text("restaurant_id").references(() => restaurants.id, {
    onDelete: "cascade",
  }),

  organizationId: text("organization_id").references(() => organization.id, {
    onDelete: "cascade",
  }),
  userId: text("user_id")
    .references(() => user.id, {
      onDelete: "cascade",
    })
    .notNull(),
  // Ad details
  title: varchar("title", { length: 255 }).notNull(), // Short catchy ad title
  description: text("description"), // Detailed ad description
  imageUrl: text("image_url"), // Banner or ad image
  redirectUrl: text("redirect_url"), // Where ad should take user

  // Ad configuration
  startDate: date("start_date"), // Ad campaign start
  endDate: date("end_date"), // Ad campaign end
  isActive: boolean("is_active").default(true), // To toggle ads

  // Optional metadata
  priority: varchar("priority", { length: 50 }).default("normal"), // high, normal, low
  placement: varchar("placement", { length: 100 }), // e.g., homepage, search results, room details

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
