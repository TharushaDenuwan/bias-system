"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

export default function VerifyEmailSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // The verification happens automatically via the URL
        // Better-auth handles the token from the URL params
        // We just need to check if we're on this page after clicking the email link
        const token = searchParams.get("token");
        const email = searchParams.get("email");

        if (!token) {
          setVerificationStatus("error");
          setErrorMessage("Invalid verification link");
          return;
        }

        // The verification is handled by better-auth middleware
        // If we reach this page, it means verification was successful
        setVerificationStatus("success");

        // Auto redirect to signin after 3 seconds
        setTimeout(() => {
          router.push("/signin");
        }, 3000);
      } catch (error) {
        setVerificationStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Verification failed"
        );
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            {verificationStatus === "loading" && (
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            )}
            {verificationStatus === "success" && (
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            )}
            {verificationStatus === "error" && (
              <div className="rounded-full bg-red-100 p-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-heading font-bold">
            {verificationStatus === "loading" && "Verifying Your Email..."}
            {verificationStatus === "success" && "Email Verified!"}
            {verificationStatus === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-base">
            {verificationStatus === "loading" &&
              "Please wait while we verify your email address."}
            {verificationStatus === "success" &&
              "Your email has been successfully verified. You can now sign in to your account."}
            {verificationStatus === "error" && errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationStatus === "success" && (
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
              <p className="font-semibold mb-1">What&apos;s next?</p>
              <p>
                You&apos;ll be redirected to the sign in page in a few
                seconds...
              </p>
            </div>
          )}

          <Button
            onClick={() => router.push("/signin")}
            className="w-full"
            variant={verificationStatus === "success" ? "default" : "outline"}
          >
            {verificationStatus === "success"
              ? "Continue to Sign In"
              : "Back to Sign In"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
