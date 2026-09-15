import { createRouter } from "@api/lib/create-app";

import * as imageHandlers from "./images/room-images.handler";
import * as imageRoutes from "./images/room-images.routes";
import * as handlers from "./rooms.handler";
import * as routes from "./rooms.routes";

const router = createRouter()
  // Room Types routes
  .openapi(routes.listRoomTypesRoute, handlers.listRoomTypesHandler)
  .openapi(routes.getRoomTypeRoute, handlers.getRoomTypeHandler)
  .openapi(routes.createRoomTypeRoute, handlers.createRoomTypeHandler)
  .openapi(routes.updateRoomTypeRoute, handlers.updateRoomTypeHandler)
  .openapi(routes.deleteRoomTypeRoute, handlers.deleteRoomTypeHandler)

  // Room Type Amenities routes
  .openapi(routes.addRoomTypeAmenityRoute, handlers.addRoomTypeAmenityHandler)
  .openapi(
    routes.removeRoomTypeAmenityRoute,
    handlers.removeRoomTypeAmenityHandler
  )

  // Room Type Images routes
  .openapi(imageRoutes.getRoomImagesRoute, imageHandlers.getRoomImagesHandler)
  .openapi(imageRoutes.addRoomImageRoute, imageHandlers.addRoomImageHandler)
  .openapi(
    imageRoutes.updateRoomImageRoute,
    imageHandlers.updateRoomImageHandler
  )
  .openapi(
    imageRoutes.removeRoomImageRoute,
    imageHandlers.removeRoomImageHandler
  )

  // Rooms routes
  .openapi(routes.listRoomsRoute, handlers.listRoomsHandler)
  .openapi(routes.getRoomRoute, handlers.getRoomHandler)
  .openapi(routes.createRoomRoute, handlers.createRoomHandler)
  .openapi(routes.updateRoomRoute, handlers.updateRoomHandler)
  .openapi(routes.deleteRoomRoute, handlers.deleteRoomHandler)
  .openapi(routes.bulkCreateRoomsRoute, handlers.bulkCreateRoomsHandler);

export default router;
