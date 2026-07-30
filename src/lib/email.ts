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

export function getMailer() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}
