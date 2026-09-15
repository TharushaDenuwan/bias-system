import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema,
} from "@api/lib/helpers";
import {
  hotelImageInsertSchema,
  hotelImageSchema,
  hotelImageUpdateSchema,
} from "../../hotels/hotel.schema";

const tags: string[] = ["PaymentsAdmin Images"];

// Get paymentsAdmin images route
export const getPaymentsAdminImagesRoute = createRoute({
  tags,
  summary: "Get images for a paymentsAdmin type",
  path: "/types/:id/images",
  method: "get",
  request: {
    params: stringIdParamSchema,
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(hotelImageSchema)),
      "PaymentsAdmin type images"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "PaymentsAdmin type not found"
    ),
  },
});

// Add paymentsAdmin image route
export const addPaymentsAdminImageRoute = createRoute({
  tags,
  summary: "Add image to paymentsAdmin type",
  method: "post",
  path: "/types/:id/images",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      hotelImageInsertSchema.omit({ hotelId: true }),
      "PaymentsAdmin image data"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      hotelImageSchema,
      "Added paymentsAdmin image"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "PaymentsAdmin type not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
  },
});

// Update paymentsAdmin image route
export const updatePaymentsAdminImageRoute = createRoute({
  tags,
  summary: "Update paymentsAdmin image",
  method: "patch",
  path: "/types/:id/images/:imageId",
  request: {
    params: z.object({
      id: z.string(),
      imageId: z.string(),
    }),
    body: jsonContentRequired(
      hotelImageUpdateSchema,
      "PaymentsAdmin image update data"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      hotelImageSchema,
      "Updated paymentsAdmin image"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Image not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
  },
});

// Remove paymentsAdmin image route
export const removePaymentsAdminImageRoute = createRoute({
  tags,
  summary: "Remove image from paymentsAdmin type",
  method: "delete",
  path: "/types/:id/images/:imageId",
  request: {
    params: z.object({
      id: z.string(),
      imageId: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Image removed from paymentsAdmin type"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Image not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
  },
});

// Export route types
export type GetPaymentsAdminImagesRoute = typeof getPaymentsAdminImagesRoute;
export type AddPaymentsAdminImageRoute = typeof addPaymentsAdminImageRoute;
export type UpdatePaymentsAdminImageRoute =
  typeof updatePaymentsAdminImageRoute;
export type RemovePaymentsAdminImageRoute =
  typeof removePaymentsAdminImageRoute;
