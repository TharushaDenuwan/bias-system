import { createRouter } from "@api/lib/create-app";

import * as handlers from "./roomBookings.handlers";
import * as routes from "./roomBookings.routes";

const router = createRouter()
  // Rooms routes
  .openapi(
    routes.listRoomBookingsByUserRoute,
    handlers.listRoomBookingsByUserHandler
  )
  .openapi(routes.listRoomBookingsRoute, handlers.listRoomBookingsHandler)
  .openapi(routes.getRoomBookingRoute, handlers.getRoomBookingHandler)
  .openapi(routes.createRoomBookingRoute, handlers.createRoomBookingHandler)
  .openapi(routes.updateRoomBookingRoute, handlers.updateRoomBookingHandler)
  .openapi(routes.deleteRoomBookingRoute, handlers.deleteRoomBookingHandler);

export default router;
