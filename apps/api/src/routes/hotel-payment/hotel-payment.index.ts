import { createRouter } from "@api/lib/create-app";

import * as handlers from "./hotel-payment.handler";
import * as routes from "./hotel-payment.routes";

const router = createRouter()
  // Hotel Payments routes
  .openapi(routes.listPaymentsHotelRoute, handlers.listPaymentsHotelsHandler)
  .openapi(routes.getPaymentsHotelRoute, handlers.getPaymentsHotelHandler)
  .openapi(routes.createPaymentsHotelRoute, handlers.createPaymentsHotelHandler)
  .openapi(routes.updatePaymentsHotelRoute, handlers.updatePaymentsHotelHandler)
  .openapi(
    routes.deletePaymentsHotelRoute,
    handlers.deletePaymentsHotelHandler
  );

export default router;
