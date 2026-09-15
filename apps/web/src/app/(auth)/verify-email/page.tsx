"use client";

import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";

import { authClient } from "@/lib/auth-client";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Email address not found");
      return;
    }

    setIsResending(true);
    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: "/verify-email",
      });
      toast.success("New verification code sent! Please check your inbox.");
      setOtp("");
    } catch (error) {
      toast.error("Failed to resend verification code");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email address not found");
      return;
    }

    if (otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit code");
      return;
    }

    setIsVerifying(true);
    setOtpError("");

    try {
      // We need to use better-auth's verify email endpoint
      // The OTP is derived from the token, so we need to verify it via the API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log("Success response:", data);
        toast.success("Email verified successfully!");
        router.push("/signin");
      } else {
        // Check if response has content before parsing
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log("Error response:", data);
          setOtpError(data.error || "Invalid verification code");
          toast.error(data.error || "Invalid verification code");
        } else {
          const text = await response.text();
          console.log("Non-JSON error response:", text);
          setOtpError("Invalid verification code");
          toast.error("Invalid verification code");
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      setOtpError("Failed to verify code. Please try again.");
      toast.error("Failed to verify code");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setOtpError("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-heading font-bold">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-base">
            We&apos;ve sent a 6-digit verification code to
          </CardDescription>
          {email && (
            <p className="text-sm font-semibold text-foreground">{email}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={otp}
                onChange={handleOtpChange}
                maxLength={6}
                className="text-center text-2xl font-mono tracking-widest"
                disabled={isVerifying}
              />
              {otpError && <p className="text-sm text-red-600">{otpError}</p>}
            </div>

            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="mb-2">
                Please enter the 6-digit code sent to your email.
              </p>
              <p className="text-muted-foreground">
                The code will expire in 15 minutes.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isVerifying || otp.length !== 6}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Verify Email
                </>
              )}
            </Button>
          </form>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              Didn&apos;t receive the code?
            </p>
            <Button
              onClick={handleResendEmail}
              variant="outline"
              className="w-full"
              disabled={isResending}
            >
              {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Resend Verification Code
            </Button>
          </div>

          <Button
            onClick={() => router.push("/signin")}
            variant="ghost"
            className="w-full"
          >
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
