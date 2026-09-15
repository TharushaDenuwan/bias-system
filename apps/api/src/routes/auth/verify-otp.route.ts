import { db } from "@api/db";
import * as schema from "@repo/database/schemas";
import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono();

// Test endpoint
app.get("/test", async (c) => {
  return c.json({ message: "Auth routes are working!" });
});

// Helper function to generate OTP from token (same as in email.ts)
function generateOTP(token: string): string {
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    hash = (hash << 5) - hash + token.charCodeAt(i);
    hash = hash & hash;
  }
  const otp = Math.abs(hash % 1000000)
    .toString()
    .padStart(6, "0");
  return otp;
}

// Verify OTP endpoint
app.post("/verify-email", async (c) => {
  try {
    const body = await c.req.json();
    const { email, otp } = body;

    console.log("OTP Verification Request:", { email, otp });

    if (!email || !otp) {
      console.log("Missing email or OTP");
      return c.json({ error: "Email and OTP are required" }, 400);
    }

    // Find the user by email
    const [userRecord] = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, email))
      .limit(1);

    if (!userRecord) {
      console.log("User not found:", email);
      return c.json({ error: "User not found" }, 404);
    }

    console.log("User found:", { id: userRecord.id, email: userRecord.email });

    // Find the verification record for this user
    const [verificationRecord] = await db
      .select()
      .from(schema.verification)
      .where(eq(schema.verification.identifier, email))
      .orderBy(desc(schema.verification.createdAt))
      .limit(1);

    if (!verificationRecord) {
      console.log("No verification record found for:", email);
      return c.json({ error: "No verification request found" }, 404);
    }

    console.log("Verification record found:", {
      id: verificationRecord.id,
      identifier: verificationRecord.identifier,
      expiresAt: verificationRecord.expiresAt,
    });

    // Check if verification has expired
    if (new Date() > verificationRecord.expiresAt) {
      console.log("Verification code has expired");
      return c.json({ error: "Verification code has expired" }, 400);
    }

    // Generate OTP from the stored token and compare
    const expectedOTP = generateOTP(verificationRecord.value);

    console.log("OTP Comparison:", {
      received: otp,
      expected: expectedOTP,
      match: otp === expectedOTP,
    });

    if (otp !== expectedOTP) {
      console.log("Invalid verification code");
      return c.json({ error: "Invalid verification code" }, 400);
    }

    // Update user's email verified status
    await db
      .update(schema.user)
      .set({
        emailVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(schema.user.id, userRecord.id));

    // Delete the verification record
    await db
      .delete(schema.verification)
      .where(eq(schema.verification.id, verificationRecord.id));

    console.log("Email verified successfully for:", email);

    return c.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return c.json({ error: "Failed to verify OTP" }, 500);
  }
});

// Debug endpoint to get OTP for testing
app.post("/debug-otp", async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    // Find the verification record for this user
    const [verificationRecord] = await db
      .select()
      .from(schema.verification)
      .where(eq(schema.verification.identifier, email))
      .orderBy(desc(schema.verification.createdAt))
      .limit(1);

    if (!verificationRecord) {
      return c.json({ error: "No verification request found" }, 404);
    }

    // Generate OTP from the stored token
    const otp = generateOTP(verificationRecord.value);

    return c.json({
      email,
      otp,
      expiresAt: verificationRecord.expiresAt,
      token: verificationRecord.value,
    });
  } catch (error) {
    console.error("Debug OTP error:", error);
    return c.json({ error: "Failed to get OTP" }, 500);
  }
});

export default app;
