/* eslint-disable prefer-const */
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import { hotelPolicies } from "@repo/database";
import { HotelPolicy } from "../hotel.schema";
import type {
  AddNewHotelPoliciesRoute,
  GetHotelPoliciesRoute,
  RemoveHotelPolicyRoute,
  UpdateHotelPolicyRoute,
  UpsertPoliciesToHotelRoute,
} from "./policies.routes";

/**
 * ================================================================
 * Hotel policies Handlers
 * ================================================================
 */

// List hotel policies route handler
export const getHotelPoliciesHandler: AppRouteHandler<
  GetHotelPoliciesRoute
> = async (c) => {
  const params = c.req.valid("param");

  const allHotelPolicies = await db.query.hotelPolicies.findMany({
    where(fields, { eq }) {
      return eq(fields.hotelId, params.id);
    },
  });

  return c.json(allHotelPolicies, HttpStatusCodes.OK);
};

// Upsert hotel policies route handler (following amenities pattern)
export const upsertPoliciesToHotelHandler: AppRouteHandler<
  UpsertPoliciesToHotelRoute
> = async (c) => {
  const body = c.req.valid("json");
  const params = c.req.valid("param");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (!session.activeOrganizationId) {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN,
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const currentPolicies = await db.query.hotelPolicies.findMany({
    where: (fields, { eq }) => eq(fields.hotelId, params.id),
  });

  if (currentPolicies.length > 0) {
    // If policies already exist, delete them first
    await db.delete(hotelPolicies).where(eq(hotelPolicies.hotelId, params.id));
  }

  let insertedPolicies: HotelPolicy[] = [];

  await Promise.all(
    body.map(async (policy) => {
      const _insertedPolicy = await db
        .insert(hotelPolicies)
        .values({
          hotelId: params.id,
          policyType: policy.policyType,
          policyText: policy.policyText,
          effectiveDate: policy.effectiveDate,
          isActive: policy.isActive ?? true,
        })
        .returning();

      if (_insertedPolicy[0]) {
        insertedPolicies.push(_insertedPolicy[0]);
      }
    })
  );

  return c.json(insertedPolicies, HttpStatusCodes.CREATED);
};

// Add new hotel policies route handler
export const addNewHotelPoliciesHandler: AppRouteHandler<
  AddNewHotelPoliciesRoute
> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (!session.activeOrganizationId) {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN,
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  let insertedPolicies: (typeof hotelPolicies.$inferSelect)[] = [];

  try {
    await Promise.all(
      body.map(async (policy) => {
        const _insertedPolicy = await db
          .insert(hotelPolicies)
          .values({
            hotelId: policy.hotelId,
            policyType: policy.policyType,
            policyText: policy.policyText,
            effectiveDate: policy.effectiveDate,
            isActive: policy.isActive ?? true,
          })
          .returning();

        if (_insertedPolicy[0]) {
          insertedPolicies.push(_insertedPolicy[0]);
        }
      })
    );

    return c.json(insertedPolicies, HttpStatusCodes.CREATED);
  } catch (error) {
    console.error("Failed to create hotel policies:", error);
    return c.json(
      {
        message: "Failed to create hotel policies",
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Update hotel policy route handler
export const updateHotelPolicyHandler: AppRouteHandler<
  UpdateHotelPolicyRoute
> = async (c) => {
  const params = c.req.valid("param");
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (!session.activeOrganizationId) {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN,
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  try {
    const updatedPolicy = await db
      .update(hotelPolicies)
      .set({
        policyType: body.policyType,
        policyText: body.policyText,
        effectiveDate: body.effectiveDate,
        isActive: body.isActive,
        updatedAt: new Date(),
      })
      .where(eq(hotelPolicies.id, params.id))
      .returning();

    if (updatedPolicy.length === 0) {
      return c.json(
        {
          message: "Policy not found",
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(updatedPolicy[0], HttpStatusCodes.OK);
  } catch (error) {
    console.error("Failed to update hotel policy:", error);
    return c.json(
      {
        message: "Failed to update hotel policy",
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Remove hotel policy route handler
export const removeHotelPolicyHandler: AppRouteHandler<
  RemoveHotelPolicyRoute
> = async (c) => {
  const params = c.req.valid("param");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (!session.activeOrganizationId) {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN,
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  try {
    const deletedPolicy = await db
      .delete(hotelPolicies)
      .where(eq(hotelPolicies.id, params.id))
      .returning();

    if (deletedPolicy.length === 0) {
      return c.json(
        {
          message: "Policy not found",
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(
      {
        message: "Hotel policy removed successfully",
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Failed to delete hotel policy:", error);
    return c.json(
      {
        message: "Failed to delete hotel policy",
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
