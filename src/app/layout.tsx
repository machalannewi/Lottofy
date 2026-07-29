import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { Fraunces, Libre_Franklin, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { clerkConfigured } from "@/lib/clerk-config";
import { WhatsAppFloat } from "@/components/Whatsappfloat";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Lottofy — Generate Your Lottery Ticket",
  description:
    "Pick a draw date and generate your free lottery ticket. Fast, fair, and transparent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <>
      {children}
      <Toaster richColors theme="dark" />
    </>
  );

  return (
    <html
      lang="en"
      className={`dark ${fraunces.variable} ${libreFranklin.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {clerkConfigured ? <ClerkProvider>{content}</ClerkProvider> : content}
        <WhatsAppFloat phoneNumber="2349027925008" />
      </body>
    </html>
  );
}
