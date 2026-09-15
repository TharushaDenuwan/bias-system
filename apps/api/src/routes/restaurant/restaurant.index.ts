import { createRouter } from "@api/lib/create-app";

import * as imageHandlers from "./images/restaurant-images.handler";
import * as imageRoutes from "./images/restaurant-images.routes";
import * as handlers from "./restaurant.handler";
import * as routes from "./restaurant.routes";

const router = createRouter()
  // Restaurant Type Images routes
  .openapi(
    imageRoutes.getRestaurantImagesRoute,
    imageHandlers.getRestaurantImagesHandler
  )
  .openapi(
    imageRoutes.addRestaurantImageRoute,
    imageHandlers.addRestaurantImageHandler
  )
  .openapi(
    imageRoutes.updateRestaurantImageRoute,
    imageHandlers.updateRestaurantImageHandler
  )
  .openapi(
    imageRoutes.removeRestaurantImageRoute,
    imageHandlers.removeRestaurantImageHandler
  )

  // Restaurants routes
  .openapi(routes.listRestaurantsRoute, handlers.listRestaurantsHandler)
  .openapi(routes.getMyRestaurantRoute, handlers.getMyRestaurantHandler)
  .openapi(routes.getRestaurantRoute, handlers.getRestaurantHandler)
  .openapi(routes.createRestaurantRoute, handlers.createRestaurantHandler)

  .openapi(routes.updateRestaurantRoute, handlers.updateRestaurantHandler)
  .openapi(routes.deleteRestaurantRoute, handlers.deleteRestaurantHandler);

export default router;
