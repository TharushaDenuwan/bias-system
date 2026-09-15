import { createRouter } from "@api/lib/create-app";

import * as imageHandlers from "./images/villa-images.handler";
import * as imageRoutes from "./images/villa-images.routes";
import * as handlers from "./villa.handler";
import * as routes from "./villa.routes";

const router = createRouter()


  // Villa Type Images routes
  .openapi(imageRoutes.getVillaImagesRoute, imageHandlers.getVillaImagesHandler)
  .openapi(imageRoutes.addVillaImageRoute, imageHandlers.addVillaImageHandler)
  .openapi(
    imageRoutes.updateVillaImageRoute,
    imageHandlers.updateVillaImageHandler
  )
  .openapi(
    imageRoutes.removeVillaImageRoute,
    imageHandlers.removeVillaImageHandler
  )

  // Villas routes
  .openapi(routes.listVillasRoute, handlers.listVillasHandler)
  .openapi(routes.getVillaRoute, handlers.getVillaHandler)
  .openapi(routes.createVillaRoute, handlers.createVillaHandler)
  .openapi(routes.updateVillaRoute, handlers.updateVillaHandler)
  .openapi(routes.deleteVillaRoute, handlers.deleteVillaHandler)

export default router;
