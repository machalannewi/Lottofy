"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getClerkErrorMessage } from "@/lib/clerk-error";
import { COUNTRIES } from "@/lib/countries";

export function SignUpForm() {
  const router = useRouter();
  const { signUp } = useSignUp();

  const [step, setStep] = useState<"form" | "verify">("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!country) {
      setError("Please select your country.");
      return;
    }
    setError(null);
    setIsPending(true);
    try {
      const { error: createError } = await signUp.password({
        emailAddress: email,
        password,
        firstName,
        lastName,
        unsafeMetadata: { phone, country },
      });

      if (createError) {
        setError(getClerkErrorMessage(createError));
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize();
        router.push("/dashboard");
        return;
      }

      const { error: codeError } = await signUp.verifications.sendEmailCode();
      if (codeError) {
        setError(getClerkErrorMessage(codeError));
        return;
      }
      setStep("verify");
    } finally {
      setIsPending(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    try {
      const { error: verifyError } = await signUp.verifications.verifyEmailCode({
        code,
      });

      if (verifyError) {
        setError(getClerkErrorMessage(verifyError));
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize();
        router.push("/dashboard");
        return;
      }

      setError("Additional verification is required for this account.");
    } finally {
      setIsPending(false);
    }
  }

  if (step === "verify") {
    return (
      <form onSubmit={handleVerify} className="space-y-4">
        <p className="text-sm text-muted-foreground">
          We sent a verification code to <strong>{email}</strong>.
        </p>
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
          {isPending ? "Verifying..." : "Verify & continue"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleCreate} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>
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
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select value={country} onValueChange={(v) => setCountry(v ?? "")}>
          <SelectTrigger id="country" className="w-full">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
      </div>
      <div id="clerk-captcha" />
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
