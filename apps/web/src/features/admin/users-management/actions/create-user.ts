"use server";

import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { CreateUserSchema } from "../schemas/create-user";

export async function createUser(values: CreateUserSchema) {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  return await authClient.admin.createUser(
    {
      ...values,
      role: values.role === "admin" ? "admin" : "user"
    },
    {
      headers: {
        ...(cookieHeader && { cookie: cookieHeader })
      }
    }
  );
}
