import { createRouter } from "@api/lib/create-app";

import * as handlers from "./hotel.handler";
import * as routes from "./hotel.routes";

import * as imageHandlers from "./images/hotel-images.handler";
import * as imageRoutes from "./images/hotel-images.routes";

import * as amenitiesHandlers from "./amenities/amenities.handler";
import * as amenitiesRoutes from "./amenities/amenities.routes";

import * as policiesHandlers from "./policies/policies.handler";
import * as policiesRoutes from "./policies/policies.routes";

const router = createRouter()
  .openapi(routes.removeHotelRoute, handlers.removeHotelHandler)
  .openapi(
    imageRoutes.getAllHotelImagesRoute,
    imageHandlers.getAllHotelImagesHandler
  )
  .openapi(routes.listAllHotelTypesRoute, handlers.listHotelTypesHandler)
  .openapi(routes.createNewHotelTypeRoute, handlers.createHotelTypeHandler)
  .openapi(routes.updateHotelTypeRoute, handlers.updateHotelTypeHandler)
  .openapi(routes.removeHotelTypeRoute, handlers.removeHotelTypeHandler)
  .openapi(routes.listAllHotelsRoute, handlers.listAllHotelsHandler)
  .openapi(routes.createNewHotelRoute, handlers.createNewHotelHandler)
  .openapi(routes.updateHotelRoute, handlers.updateHotelHandler)
  .openapi(
    routes.createNewHotelRouteByAdmin,
    handlers.createNewHotelByAdminHandler
  )
  .openapi(routes.getMyHotelRoute, handlers.getMyHotelHandler)
  .openapi(routes.getHotelRoomTypesRoute, handlers.getHotelRoomTypesHandler)
  .openapi(routes.getHotelRoomsRoute, handlers.getHotelRoomsHandler)
  .openapi(routes.getHotelByIdRoute, handlers.getHotelByIdHandler)

  // Hotel Images Management

  .openapi(imageRoutes.getHotelImagesRoute, imageHandlers.getHotelImagesHandler)
  .openapi(
    imageRoutes.addNewHotelImagesRoute,
    imageHandlers.addNewHotelImagesHandler
  )
  .openapi(
    imageRoutes.updateHotelImageRoute,
    imageHandlers.updateHotelImageHandler
  )
  .openapi(
    imageRoutes.removeHotelImageRoute,
    imageHandlers.removeHotelImageHandler
  )

  // Hotel amentities
  .openapi(
    amenitiesRoutes.getHotelAmenitiesRoute,
    amenitiesHandlers.getHotelAmenitiesHandler
  )
  .openapi(
    amenitiesRoutes.upsertAmenitiesToHotelRoute,
    amenitiesHandlers.upsertAmenitiesToHotelHandler
  )

  // Hotel policies
  .openapi(
    policiesRoutes.getHotelPoliciesRoute,
    policiesHandlers.getHotelPoliciesHandler
  )
  .openapi(
    policiesRoutes.upsertPoliciesToHotelRoute,
    policiesHandlers.upsertPoliciesToHotelHandler
  );

export default router;
