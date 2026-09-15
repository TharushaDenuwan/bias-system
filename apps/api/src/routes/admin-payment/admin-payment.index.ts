import { createRouter } from "@api/lib/create-app";

import * as handlers from "./admin-payment.handler";
import * as routes from "./admin-payment.routes";

const router = createRouter()
  // Admin Payments routes
  .openapi(routes.listPaymentsAdminRoute, handlers.listPaymentsAdminsHandler)
  .openapi(routes.getPaymentsAdminRoute, handlers.getPaymentsAdminHandler)
  .openapi(routes.createPaymentsAdminRoute, handlers.createPaymentsAdminHandler)
  .openapi(routes.updatePaymentsAdminRoute, handlers.updatePaymentsAdminHandler)
  .openapi(
    routes.deletePaymentsAdminRoute,
    handlers.deletePaymentsAdminHandler
  );

export default router;
