"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getClerkErrorMessage } from "@/lib/clerk-error";

type Step = "credentials" | "verify-client-trust";

export function SignInForm() {
  const router = useRouter();
  const { signIn } = useSignIn();

  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function finalizeIfComplete() {
    if (signIn.status === "complete") {
      await signIn.finalize();
      router.push("/dashboard");
      return true;
    }
    return false;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    try {
      const { error: signInError } = await signIn.password({
        identifier: email,
        password,
      });

      if (signInError) {
        setError(getClerkErrorMessage(signInError));
        return;
      }

      if (await finalizeIfComplete()) return;

      // Client Trust: signing in from a device/browser Clerk hasn't seen
      // before. This is on by default and is unrelated to bot/CAPTCHA
      // protection — it needs its own code-verification step.
      if (signIn.status === "needs_client_trust") {
        const emailCodeFactor = signIn.supportedSecondFactors?.find(
          (factor) => factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
          setStep("verify-client-trust");
          return;
        }

        setError(
          "This device needs to be verified, but no email verification method is available on this account. Please contact support.",
        );
        return;
      }

      if (signIn.status === "needs_second_factor") {
        setError(
          "Two-factor authentication is required for this account, which isn't supported by this form yet.",
        );
        return;
      }

      setError("Additional verification is required for this account.");
    } finally {
      setIsPending(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    try {
      const { error: verifyError } = await signIn.mfa.verifyEmailCode({ code });

      if (verifyError) {
        setError(getClerkErrorMessage(verifyError));
        return;
      }

      if (await finalizeIfComplete()) return;

      setError("Verification wasn't completed. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  async function handleResendCode() {
    setError(null);
    await signIn.mfa.sendEmailCode();
  }

  function handleStartOver() {
    signIn.reset();
    setStep("credentials");
    setCode("");
    setError(null);
  }

  if (step === "verify-client-trust") {
    return (
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <p className="text-sm font-medium">Verify this device</p>
          <p className="text-sm text-muted-foreground">
            We sent a verification code to {email}. Enter it below to continue.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="code">Verification code</Label>
          <Input
            id="code"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Verifying..." : "Verify"}
        </Button>

        <div className="flex justify-between text-sm">
          <button
            type="button"
            onClick={handleResendCode}
            className="text-primary hover:underline"
          >
            Resend code
          </button>
          <button
            type="button"
            onClick={handleStartOver}
            className="text-muted-foreground hover:underline"
          >
            Start over
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div id="clerk-captcha" />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
