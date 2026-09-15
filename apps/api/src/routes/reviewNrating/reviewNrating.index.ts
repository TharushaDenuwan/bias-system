import { createRouter } from "@api/lib/create-app";

import * as handlers from "./reviewNrating.handlers";
import * as routes from "./reviewNrating.routes";

const router = createRouter()
  .openapi(routes.listByHotelId, handlers.listByHotelId)
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getById, handlers.getOne)
  .openapi(routes.update, handlers.patch)
  .openapi(routes.remove, handlers.remove);

export default router;
