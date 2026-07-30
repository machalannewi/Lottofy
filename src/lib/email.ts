// import "server-only";
// import { Resend } from "resend";

// const FROM = process.env.RESEND_FROM_EMAIL ?? "Lottofy <onboarding@resend.dev>";

// export async function sendEmail(input: {
//   to: string | string[];
//   subject: string;
//   text: string;
// }) {
//   const apiKey = process.env.RESEND_API_KEY;
//   if (!apiKey) return { sent: false as const };

//   const resend = new Resend(apiKey);
//   await resend.emails.send({
//     from: FROM,
//     to: input.to,
//     subject: input.subject,
//     text: input.text,
//   });
//   return { sent: true as const };
// }

import nodemailer from "nodemailer";

const REQUIRED_ENV_VARS = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"] as const;

export function getMailer() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    // Without this check, nodemailer would otherwise fail with a vague
    // "connect ECONNREFUSED" or "Missing credentials" error that doesn't
    // point at which env var is actually absent.
    throw new Error(
      `Missing required SMTP env vars: ${missing.join(", ")}. Check your .env.local (dev) or your host's environment variables (production).`
    );
  }

  const port = Number(process.env.SMTP_PORT);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // Port 465 requires secure:true (implicit TLS). Port 587 (and 25)
    // require secure:false — they use STARTTLS instead, negotiated after
    // the connection opens. Mismatching these two is one of the most
    // common causes of nodemailer silently timing out or refusing to
    // connect. Default here matches SMTP_PORT unless SMTP_SECURE is set
    // explicitly, so a stray/missing SMTP_SECURE var can't fight the port.
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Call this once during development to confirm your SMTP credentials and
 * connection actually work, independent of the rest of your app. Easiest
 * way to run it: temporarily call it from a scratch API route, or run
 * `node -e "require('./src/lib/email').verifyMailer()"` against the
 * compiled output.
 */
export async function verifyMailer() {
  const transporter = getMailer();
  await transporter.verify();
  console.log("SMTP connection verified successfully.");
}