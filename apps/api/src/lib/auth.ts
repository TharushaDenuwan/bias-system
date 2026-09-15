import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  admin as adminPlugin,
  openAPI,
  organization,
} from "better-auth/plugins";

import { db } from "@api/db";
import env from "@api/env";
import { emailService } from "@api/lib/email";
import * as schema from "@repo/database/schemas";

export const auth = betterAuth({
  // Cross-Domain Features
  trustedOrigins: [env.CLIENT_APP_URL],
  baseURL: env.BETTER_AUTH_URL,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,

    sendResetPassword: async ({ user, url, token }) => {
      await emailService.sendPasswordResetEmail(user.email, url, token);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 900, // 15 minutes in seconds (900 seconds)
    sendVerificationEmail: async ({ user, url, token }) => {
      await emailService.sendVerificationEmail(user.email, url, token);
    },
  },
  socialProviders: {
    // facebook: {
    // },
  },
  plugins: [
    adminPlugin(),
    openAPI(),
    organization({
      allowUserToCreateOrganization() {
        // TODO: In future, Allow permissions based on user's subscription
        return true;
      },
    }),
  ],
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
    defaultCookieAttributes: {
      sameSite: "lax",
      httpOnly: true,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
