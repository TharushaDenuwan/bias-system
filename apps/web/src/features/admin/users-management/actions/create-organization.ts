"use server";

import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { CreateOrganizationSchema } from "../schemas/create-organization";

export async function createOrganization(values: CreateOrganizationSchema) {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  return await authClient.organization.create(values, {
    headers: {
      ...(cookieHeader && { cookie: cookieHeader })
    }
  });
}
