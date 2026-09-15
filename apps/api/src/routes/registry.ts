import { createRouter } from "@api/lib/create-app";
import { AppOpenAPI } from "@api/types";

import { BASE_PATH } from "../lib/constants";
import paymentsAdmin from "./admin-payment/admin-payment.index";
import ads from "./ads/ads.index";
import article from "./article/article.index";
import verifyOtp from "./auth/verify-otp.route";
import destination from "./destination/destination.index";
import paymentsHotel from "./hotel-payment/hotel-payment.index";
import hotels from "./hotels/hotel.index";
import index from "./index.route";
import media from "./media/media.index";
import propertyClasses from "./property-classes/property-classes.index";
import restaurantTable from "./restaurant-table/restaurant-table.index";
import restaurant from "./restaurant/restaurant.index";
import reviewNrating from "./reviewNrating/reviewNrating.index";
import roomBookings from "./room-booking/roomBookings.index";
import rooms from "./rooms/rooms.index";
import system from "./system/system.index";
import tasks from "./tasks/tasks.index";
import villas from "./villa/villa.index";
import wiishlist from "./wishlist/wishlist.index.ts";

export function registerRoutes(app: AppOpenAPI) {
  return app
    .route("/", index)
    .route("/auth", verifyOtp)
    .route("/tasks", tasks)
    .route("/system", system)
    .route("/media", media)
    .route("/property-classes", propertyClasses)
    .route("/hotels", hotels)
    .route("/room-bookings", roomBookings)
    .route("/rooms", rooms)
    .route("/villa", villas)
    .route("/payments-admin", paymentsAdmin)
    .route("/restaurant", restaurant)
    .route("/article", article)
    .route("/restaurant-table", restaurantTable)
    .route("/review", reviewNrating)
    .route("/ads", ads)
    .route("/wishlist", wiishlist)
    .route("/destination", destination)
    .route("/payments-hotel", paymentsHotel);
}

// stand alone router type used for api client
export const router = registerRoutes(createRouter().basePath(BASE_PATH));

export type Router = typeof router;
